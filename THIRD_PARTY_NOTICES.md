# Verwendete Fremdbibliotheken und Schriften

| Baustein | Version | Lizenz | Wie eingebunden |
|---|---|---|---|
| [three.js](https://github.com/mrdoob/three.js) | r128 | MIT, Copyright © 2010-2021 three.js authors | per CDN (cdnjs) im Browser geladen, nicht im Repository enthalten |
| [tiktok-live-connector](https://github.com/zerodytrash/TikTok-Live-Connector) | 2.5.0 | AGPL-3.0-only | npm-Abhängigkeit von `server.js` |
| tiktok-live-proto (Abhängigkeit davon) | – | AGPL-3.0-only | npm |
| @bufbuild/protobuf, tiktok-live-api-sdk, got, typed-emitter | – | Apache-2.0 / BSD-3-Clause / MIT | npm |
| [ws](https://github.com/websockets/ws) | 8.23.0 | MIT, Copyright (c) 2011 Einar Otto Stangvik, (c) 2013 Arnout Kazemier and contributors, (c) 2016 Luigi Pinca and contributors | npm-Abhängigkeit von `server.js` |
| Schrift [Cinzel](https://fonts.google.com/specimen/Cinzel) | – | SIL Open Font License 1.1 | über Google Fonts geladen |
| Schrift [Inter](https://fonts.google.com/specimen/Inter) | – | SIL Open Font License 1.1 | über Google Fonts geladen |

Ebenfalls im Spiel, ohne fremde Rechte:
- **Sounds**: Alle Klänge werden im Browser per WebAudio erzeugt. Es gibt keine Musik- oder Sounddateien und damit keine GEMA-/Musikrechte.
- **Karte**: Die Küsten sind von Hand nach Koordinaten gezeichnet. Es werden keine Kartendaten von Google, OpenStreetMap o. ä. verwendet.
- **Flaggen**: Die Flaggen sind im Code nachgezeichnet. Nationalflaggen sind nicht urheberrechtlich geschützt, siehe aber `RECHTLICHES.md` zum respektvollen Umgang.
- **Fremddienst**: `tiktok-live-connector` lässt die Verbindung zu TikTok über den Dienst Euler Stream signieren. Dabei werden dein TikTok-Name bzw. die Raum-ID dorthin übertragen, aber **keine** Login-Daten (die Optionen `session`/`authenticateWs` sind nicht aktiviert).
