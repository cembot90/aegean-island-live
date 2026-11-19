# Rechtliches & Regeln: Checkliste für den Stream

> Das ist eine Checkliste und **keine Rechtsberatung**. Bevor du regelmäßig Geld verdienst,
> lass die offenen Punkte von einer Steuerberatung bzw. Anwältin oder einem Anwalt prüfen.

## ✅ Im Projekt schon erledigt
- **Lizenzen sauber getrennt:** Das Spiel gehört dir (alle Rechte vorbehalten). Die TikTok-Brücke `server.js` steht unter der AGPL-3.0, weil sie eine AGPL-Bibliothek nutzt. Der Quelltext ist öffentlich, damit sind die AGPL-Pflichten erfüllt. Details in `LIZENZ.md`.
- **Fremdbausteine aufgelistet:** in `THIRD_PARTY_NOTICES.md`. Es gibt keine fremde Musik, keine fremden Bilder und keine fremden Kartendaten.
- **Kein Glücksspiel:** Geschenke lösen immer **feste, vorher angezeigte** Effekte aus (Rose = 5 Soldaten, 99 💎 = Legendenschiff). Es gibt keine Verlosung, kein Glücksrad und keine Preise in Geld oder Gutscheinen.
- **Keine falschen Zuschauer im echten Stream:** Sobald `server.js` einmal verbunden war, startet der Demo-Modus nie wieder von selbst. Für die OBS-Quelle zusätzlich `?demo=0` nutzen, siehe unten.
- **Daten sparsam:** In `data/ranks.json` speichert der Server nur TikTok-ID, Anzeigename und Punktzahl. Profilbilder speichert er nicht. Der Ordner `data/` wird nicht auf GitHub hochgeladen.
- **Statistik privat:** `server.js` ist nur auf deinem eigenen Rechner erreichbar (127.0.0.1), auch `/stats`.

## ⚠️ Das musst du selbst klären
1. **TikTok-Nutzungsbedingungen:** `tiktok-live-connector` ist **inoffiziell** (Reverse Engineering) und nicht von TikTok freigegeben. Das ist das größte Risiko für dein Konto, größer als jede Lizenzfrage. Die Bibliothek nutzen viele, eine Garantie gibt es aber nicht. Lies die TikTok-Nutzungsbedingungen, die LIVE-Monetarisierungsrichtlinien und die LIVE-Funktionsrichtlinien.
2. **Einverständnis von UĞURCAN und CEM:** Die Helden tragen die Namen echter Personen. Lass dir von beiden schriftlich bestätigen, dass ihre Namen im Spiel und im Stream erscheinen dürfen, auch wenn du damit Geld verdienst. Eine kurze Nachricht reicht.
3. **Impressum:** Wenn du mit deinem Kanal Geld verdienst, brauchst du in Deutschland in der Regel ein Impressum, das von deinem Profil aus erreichbar ist (z. B. als Link in der Bio).
4. **Gewerbe & Steuern:** Einnahmen aus Geschenken sind steuerpflichtig. Ob du ein Gewerbe anmelden musst und wie Einkommen- und Umsatzsteuer (Kleinunternehmerregelung) aussehen, klärst du mit einer Steuerberatung oder deinem Finanzamt.
5. **Datenschutz:** Weil du TikTok-Namen speicherst (Ränge über mehrere Streams), schreib einen Satz in dein Profil oder deine Stream-Info, z. B. *„Spielstände mit deinem TikTok-Namen werden lokal gespeichert, auf Wunsch lösche ich sie.“* Löschen: den Eintrag aus `data/ranks.json` entfernen oder die Datei löschen.
6. **Politisches Thema:** Griechenland, Türkei und Zypern sind ein sensibles Thema. Das Spiel endet immer mit Frieden und zeigt Flaggen respektvoll. In beiden Ländern ist der Umgang mit Staatssymbolen gesetzlich geschützt, also nie Flaggen verspotten oder verbrennen lassen. Nutze Moderatoren und TikToks Wortfilter gegen Hass im Chat. Prüfe in den TikTok-Regeln, ob politische Inhalte bei der Monetarisierung eingeschränkt sind.
7. **Alter:** Für LIVE-Geschenke musst du laut TikTok mindestens 18 sein. Ruf niemals Minderjährige zum Schenken auf.

## 🎥 Sichere Einstellung für OBS / TikTok LIVE Studio
Browser-Quelle: `http://localhost:8787/?demo=0`
- `demo=0` bedeutet: Es erscheinen niemals simulierte Zuschauer oder Geschenke.
- Wenn TikTok den Chat unten über das Spiel legt: `&bottom=120` (Abstand in Pixeln) anhängen und auf dem Handy prüfen.

## 💬 Faire Ansagen im Stream (gut für Vertrauen und Regeln)
- ✅ „Mit einer Rose bekommt dein Team 5 Soldaten, mit 99 💎 segelt dein eigenes Legendenschiff.“
- ✅ „Danke an alle Unterstützer! Ihr steht auf der Bestenliste.“
- ❌ Nichts versprechen, was Geld wert ist („Wer am meisten schenkt, bekommt 50 €“).
- ❌ Keine Verlosungen oder Zufallspreise für Geschenke.
- ❌ Keinen Druck machen („Wenn jetzt keiner schenkt, verlieren wir“). Der Frieden gewinnt sowieso.
