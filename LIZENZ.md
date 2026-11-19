# Lizenz

Dieses Repository besteht aus zwei Teilen mit unterschiedlicher Lizenz.

## 1. Das Spiel: `index.html`, `goetter.html`, Bilder
Copyright (c) 2026 cembot90. **Alle Rechte vorbehalten.**

Der Code ist öffentlich einsehbar, aber du darfst ihn ohne Erlaubnis des Rechteinhabers
nicht kopieren, verändern, weitergeben oder für eigene Streams nutzen.
Das Spiel ist ein eigenständiges Programm. Es empfängt nur Daten (JSON über WebSocket) von
`server.js` und bindet keine AGPL-Bibliothek ein.

## 2. Die TikTok-Brücke: `server.js`
`server.js` nutzt die Bibliothek `tiktok-live-connector` (Version 2.5.0), die unter der
**GNU Affero General Public License v3.0 (AGPL-3.0-only)** steht.
Deshalb steht auch `server.js` unter der **AGPL-3.0-only**, siehe `LICENSE-AGPL-3.0.txt`.

Was das für dich heißt:
- Du darfst `server.js` frei nutzen, auch kommerziell (z. B. in Streams mit Geschenken).
- Wenn du `server.js` veränderst und weitergibst, oder anderen über ein Netzwerk zur Nutzung
  anbietest, musst du den Quelltext deiner Version unter der AGPL-3.0 bereitstellen.
  Dieses öffentliche Repository erfüllt das.

## Fremdbibliotheken und Schriften
Siehe `THIRD_PARTY_NOTICES.md`.

> Hinweis: Diese Aufteilung beruht auf der üblichen Auslegung („getrennte Programme, die nur
> Daten austauschen“). Das ist eine rechtliche Einschätzung, keine Rechtsberatung. Wer ganz
> sichergehen will, stellt das gesamte Repository unter die AGPL-3.0.
