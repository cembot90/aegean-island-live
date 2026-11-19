// SPDX-License-Identifier: AGPL-3.0-only
// Brücke: TikTok LIVE  ->  WebSocket  ->  Spiel im Browser / OBS
// Copyright (c) 2026 cembot90
// Diese Datei nutzt tiktok-live-connector (AGPL-3.0-only) und steht deshalb selbst unter der AGPL-3.0, siehe LICENSE-AGPL-3.0.txt.
// Der Quelltext ist öffentlich: https://github.com/cembot90/aegean-island-live
// Start:  node server.js DEIN_TIKTOK_NAME
// Geschenk-Rohdaten anzeigen (zum Prüfen beim ersten Live):  DEBUG_GIFTS=1 node server.js DEIN_TIKTOK_NAME
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocketServer } from 'ws';
import { TikTokLiveConnection, WebcastEvent } from 'tiktok-live-connector';

const PORT = +(process.env.PORT || 8787);
const HOST = process.env.HOST || '127.0.0.1'; // nur auf diesem Rechner erreichbar (Statistik und Ränge bleiben privat)
const DEBUG_GIFTS = process.env.DEBUG_GIFTS === '1';
// Grobe Schätzung, keine Garantie: Der Geschenkwert kommt (vermutlich) in Coins. Laut Drittquellen erhält der Creator
// etwa 1 Diamant pro 2 Coins, und 1 Diamant ≈ 0,005 $. Beides beim ersten Live mit DEBUG_GIFTS=1 und im TikTok-LIVE-Center prüfen.
const DIAMONDS_PER_COIN = +(process.env.DIAMONDS_PER_COIN || 0.5);
const USD_PER_DIAMOND = +(process.env.USD_PER_DIAMOND || 0.005);
const username = (process.argv[2] || process.env.TIKTOK_USER || '').replace(/^@/, '');
const dir = path.dirname(fileURLToPath(import.meta.url));

// --- Dauerhafte Ränge (bleiben über Streams erhalten) ------------------
// Liegt in data/ und ist per .gitignore vom öffentlichen Repository ausgeschlossen (echte Zuschauernamen!)
const DATA_DIR = path.join(dir, 'data'), RANKS_FILE = path.join(DATA_DIR, 'ranks.json');
let ranks = {};
try { ranks = JSON.parse(fs.readFileSync(RANKS_FILE, 'utf8')); } catch {}
let saveTimer = null;
const saveRanks = () => {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { fs.mkdirSync(DATA_DIR, { recursive: true }); fs.writeFileSync(RANKS_FILE, JSON.stringify(ranks)); } catch (e) { console.error('Ränge nicht gespeichert:', e.message); }
  }, 1000);
};

// --- Einnahmen dieser Sitzung (nur für dich, unter /stats) --------------
const session = { start: new Date(), diamonds: 0, gifts: 0, gifters: {} };

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function statsPage() {
  const top = Object.values(session.gifters).sort((a, b) => b.diamonds - a.diamonds).slice(0, 15);
  const all = Object.values(ranks).sort((a, b) => b.total - a.total).slice(0, 20);
  const creatorDia = Math.round(session.diamonds * DIAMONDS_PER_COIN), usd = (creatorDia * USD_PER_DIAMOND).toFixed(2);
  const mins = Math.round((Date.now() - session.start) / 60000);
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="refresh" content="15"><title>Stream-Statistik</title>
<style>body{font:15px/1.5 system-ui,sans-serif;background:#0b2233;color:#eef;margin:0;padding:20px max(16px,env(safe-area-inset-left))}
h1{font-size:20px;margin:0 0 4px}.big{display:flex;gap:12px;flex-wrap:wrap;margin:14px 0}.big div{background:#123a55;padding:10px 14px;border-radius:10px}
.big b{display:block;font-size:24px}table{border-collapse:collapse;width:100%;max-width:640px;margin-bottom:24px}td,th{text-align:left;padding:4px 8px;border-bottom:1px solid #234}
th{opacity:.7;font-weight:600}small{opacity:.7}</style></head><body>
<h1>Stream-Statistik${username ? ' · @' + esc(username) : ''}</h1><small>Nur für dich, nicht im Stream zeigen. Aktualisiert alle 15 s.</small>
<div class="big"><div><b>${session.diamonds}</b>🪙 Geschenkwert (Coins)</div><div><b>≈ ${creatorDia}</b>💎 für dich (Schätzung)</div><div><b>≈ ${usd} $</b>Schätzung</div><div><b>${session.gifts}</b>Geschenke</div><div><b>${mins}</b>Minuten</div></div>
<small>Nur eine grobe Schätzung (${DIAMONDS_PER_COIN} 💎 pro Coin, ${USD_PER_DIAMOND} $ pro 💎). Was TikTok wirklich gutschreibt und auszahlt, steht in deinem LIVE-Center.</small>
<h2>Top-Unterstützer·innen dieser Sitzung</h2><table><tr><th>#</th><th>Name</th><th>🪙 Coins</th></tr>
${top.map((g, i) => `<tr><td>${i + 1}</td><td>${esc(g.nick)}</td><td>${g.diamonds}</td></tr>`).join('') || '<tr><td colspan="3">Noch keine Geschenke</td></tr>'}</table>
<h2>Stammspieler·innen (alle Streams)</h2><table><tr><th>#</th><th>Name</th><th>Punkte</th></tr>
${all.map((u, i) => `<tr><td>${i + 1}</td><td>${esc(u.nick)}</td><td>${Math.floor(u.total)}</td></tr>`).join('') || '<tr><td colspan="3">Noch leer</td></tr>'}</table>
</body></html>`;
}

const server = http.createServer((req, res) => {
  const url = (req.url || '/').split('?')[0];
  if (url === '/stats') { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); return res.end(statsPage()); }
  if (url === '/stats.json') { res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ session, creatorDiamondsEstimate: session.diamonds * DIAMONDS_PER_COIN, usdEstimate: session.diamonds * DIAMONDS_PER_COIN * USD_PER_DIAMOND })); }
  if (url === '/goetter.html') { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); return fs.createReadStream(path.join(dir, 'goetter.html')).pipe(res); }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  fs.createReadStream(path.join(dir, 'index.html')).pipe(res);
});
const wss = new WebSocketServer({ server });
const broadcast = obj => { const s = JSON.stringify(obj); wss.clients.forEach(c => c.readyState === 1 && c.send(s)); };
// Status geht als Code ans Spiel, das ihn in der eingestellten Sprache (TR/DE) anzeigt
let statusMsg = { type: 'status', code: 'waiting' };
wss.on('connection', ws => {
  ws.send(JSON.stringify(statusMsg));
  ws.send(JSON.stringify({ type: 'ranks', users: Object.values(ranks) }));
  ws.on('message', raw => {
    try {
      const m = JSON.parse(raw);
      if (m.type === 'save' && Array.isArray(m.users)) {
        for (const u of m.users.slice(0, 2000)) {
          if (!u || typeof u.id !== 'string' || u.id.startsWith('tester_')) continue;
          ranks[u.id] = { id: u.id, nick: String(u.nick || u.id).slice(0, 40), total: Math.max(+u.total || 0, ranks[u.id]?.total || 0) };
        }
        saveRanks();
      }
    } catch {}
  });
});
const status = (code, text, extra = {}) => { statusMsg = { type: 'status', code, ...extra }; console.log(text); broadcast(statusMsg); };

server.listen(PORT, HOST, () => {
  console.log(`\n🎮 Spiel läuft auf  http://localhost:${PORT}  (als Browser-Quelle in OBS / TikTok LIVE Studio einfügen)`);
  console.log(`   Demo ohne TikTok: http://localhost:${PORT}/?demo=1`);
  console.log(`   Deine Statistik:  http://localhost:${PORT}/stats  (nur für dich)\n`);
});

if (!username) {
  console.log('⚠  Kein TikTok-Name angegeben. Starte mit:  node server.js DEIN_TIKTOK_NAME');
} else {
  // Profilbild: je nach Bibliotheksversion steckt die URL in einem anderen Feld
  const pic = u => {
    if (!u) return undefined;
    const direct = [u.profilePictureUrl, u.avatarThumb?.url?.[0], u.avatarThumb?.urlList?.[0], u.avatarThumb?.mUrls?.[0],
      u.avatarMedium?.mUrls?.[0], u.avatarLarge?.mUrls?.[0], u.profilePicture?.url?.[0], u.profilePicture?.urls?.[0]];
    const hit = direct.find(x => typeof x === 'string' && x.startsWith('http'));
    if (hit) return hit;
    const m = JSON.stringify(u.avatarThumb || u.avatarMedium || u.profilePicture || {}).match(/https?:[^"]+/);
    return m ? m[0] : undefined;
  };
  const user = d => ({ user: d.user?.uniqueId, nick: d.user?.nickname || d.user?.uniqueId, avatar: pic(d.user) });
  const conn = new TikTokLiveConnection(username);

  const connect = () => conn.connect()
    .then(s => status('connected', `● LIVE verbunden mit @${username} (Raum ${s.roomId})`, { user: username }))
    .catch(err => { status('failed', 'Verbindung fehlgeschlagen (bist du live?), neuer Versuch in 15 s'); console.error(err?.message || err); setTimeout(connect, 15000); });

  conn.on(WebcastEvent.CHAT,   d => broadcast({ type: 'chat', ...user(d), comment: d.comment }));
  conn.on(WebcastEvent.LIKE,   d => broadcast({ type: 'like', ...user(d), count: d.likeCount || 1 }));
  conn.on(WebcastEvent.FOLLOW, d => broadcast({ type: 'follow', ...user(d) }));
  conn.on(WebcastEvent.SHARE,  d => broadcast({ type: 'share', ...user(d) }));
  conn.on(WebcastEvent.GIFT,   d => {
    if (DEBUG_GIFTS) console.log('[GIFT roh]', JSON.stringify(d).slice(0, 2000));
    // Aktuelle Bibliothek: Daten in d.gift (diamondCount, name, type). Ältere: d.giftDetails (diamondCount, giftName, giftType)
    const g = d.gift || d.giftDetails || {};
    const giftType = g.type ?? g.giftType;
    // Bei Serien-Geschenken (Typ 1) erst am Ende der Serie zählen
    if (giftType === 1 && !d.repeatEnd) return;
    const diamonds = +(g.diamondCount ?? d.diamondCount ?? 1) || 1;
    const count = +d.repeatCount || 1;
    const u = user(d);
    session.diamonds += diamonds * count; session.gifts += count;
    const key = u.user || u.nick || 'anon';
    session.gifters[key] = { nick: u.nick || key, diamonds: (session.gifters[key]?.diamonds || 0) + diamonds * count };
    if (DEBUG_GIFTS) console.log(`[GIFT] ${u.nick}: ${g.name || g.giftName} x${count} = ${diamonds * count} 💎`);
    broadcast({ type: 'gift', ...u, giftName: g.name || g.giftName || 'Gift', diamonds, count });
  });
  conn.on(WebcastEvent.STREAM_END, () => { status('ended', 'Stream beendet'); setTimeout(connect, 15000); });
  conn.on('disconnected', () => { status('disconnected', 'Getrennt, neuer Versuch in 15 s'); setTimeout(connect, 15000); });
  connect();
}
