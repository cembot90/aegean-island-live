// Brücke: TikTok LIVE  ->  WebSocket  ->  Spiel im Browser / OBS
// Start:  node server.js DEIN_TIKTOK_NAME
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocketServer } from 'ws';
import { TikTokLiveConnection, WebcastEvent } from 'tiktok-live-connector';

const PORT = +(process.env.PORT || 8787);
const username = (process.argv[2] || process.env.TIKTOK_USER || '').replace(/^@/, '');
const dir = path.dirname(fileURLToPath(import.meta.url));

const server = http.createServer((req, res) => {
  const file = path.join(dir, 'index.html');
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  fs.createReadStream(file).pipe(res);
});
const wss = new WebSocketServer({ server });
const broadcast = obj => { const s = JSON.stringify(obj); wss.clients.forEach(c => c.readyState === 1 && c.send(s)); };
let statusText = 'Warte auf TikTok…';
wss.on('connection', ws => ws.send(JSON.stringify({ type: 'status', text: statusText })));
const status = text => { statusText = text; console.log(text); broadcast({ type: 'status', text }); };

server.listen(PORT, () => {
  console.log(`\n🎮 Spiel läuft auf  http://localhost:${PORT}  (als Browser-Quelle in OBS / TikTok LIVE Studio einfügen)`);
  console.log(`   Demo ohne TikTok: http://localhost:${PORT}/?demo=1\n`);
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
    .then(s => status(`● LIVE verbunden mit @${username} (Raum ${s.roomId})`))
    .catch(err => { status(`Verbindung fehlgeschlagen (bist du live?) – neuer Versuch in 15 s`); console.error(err?.message || err); setTimeout(connect, 15000); });

  conn.on(WebcastEvent.CHAT,   d => broadcast({ type: 'chat', ...user(d), comment: d.comment }));
  conn.on(WebcastEvent.LIKE,   d => broadcast({ type: 'like', ...user(d), count: d.likeCount || 1 }));
  conn.on(WebcastEvent.FOLLOW, d => broadcast({ type: 'follow', ...user(d) }));
  conn.on(WebcastEvent.SHARE,  d => broadcast({ type: 'share', ...user(d) }));
  conn.on(WebcastEvent.GIFT,   d => {
    // Bei Serien-Geschenken (giftType 1) erst am Ende der Serie zählen
    if (d.giftDetails?.giftType === 1 && !d.repeatEnd) return;
    broadcast({
      type: 'gift', ...user(d),
      giftName: d.giftDetails?.giftName || 'Geschenk',
      diamonds: d.giftDetails?.diamondCount ?? d.diamondCount ?? 1,
      count: d.repeatCount || 1,
    });
  });
  conn.on(WebcastEvent.STREAM_END, () => { status('Stream beendet'); setTimeout(connect, 15000); });
  conn.on('disconnected', () => { status('Getrennt – neuer Versuch in 15 s'); setTimeout(connect, 15000); });
  connect();
}
