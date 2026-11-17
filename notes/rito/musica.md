# La musica del rito: candidati, misure, scelta provvisoria

18 novembre 2026, notte. Passo 1 di `PROGETTO.md`. **Nessuno qui ha ascoltato niente**: la scelta è fatta con le
misure, e resta provvisoria finché Andrea e lei non fanno la prova alla cieca (`<sito>/ascolto/`).

## Da dove vengono

- **Brani:** 25 candidati da incompetech.com (Kevin MacLeod, CC BY 4.0), cinque per aria, scelti dal catalogo
  (`pieces.json`: bpm, strumenti, «feel») con la ricetta di ogni aria e senza batteria né sintetizzatori; nessuno
  è già nel gioco (controllato su `tracks.js` e `CREDITS.md`). Lista e motivo: `scripts/audio/candidates.tsv`;
  scaricati uno alla volta (solo i primi 8 MB) da `scripts/audio/fetch-rite.sh`.
- **Note delle braci e motivo d'apertura:** University of Iowa Electronic Music Studios (uso libero, «without
  restrictions»): violoncello La3, chitarra Re4, contrabbasso Re2, crotalo La6, flauto contralto Mi4, e un colpo di
  gong thailandese accordato Re4 per l'apertura (la campana di `sfx.js` non è usata). Tagliate, controllate
  nell'altezza (pYIN) e accordate se fuori di più di 12 cent: `scripts/audio/notes.py`.
- Wikimedia Commons ha risposto «too many requests» alla prima ricerca sulle campane tibetane: mi sono fermato e
  sono passato a Iowa, senza riprovare.

## Come si misura (`scripts/audio/measure.py`, librosa)

Ogni file è decodificato in mono e misurato sul pezzo intero (fino a 150 s) e sui **primi 20 secondi** (quello che
lei sente per primo): tempo (stima dall'inviluppo degli attacchi; quella del catalogo è più affidabile sul rubato e
viene usata per la ricetta), modo (profilo cromatico contro Krumhansl-Kessler: r maggiore − r minore; vicino a 0 =
ambiguo), registro (altezza media pesata, in MIDI), centroide spettrale, attacchi al secondo (legato/staccato),
quota percussiva (HPSS: il pizzicato sta in alto), spazio (quota di silenzio a −25 dB), polifonia (entropia del
cromagramma), loudness integrata e range (ebur128). La **distanza dalla ricetta** somma di quanto ogni misura esce
dall'intervallo della sua aria (`RECIPE` nello script, tarato dopo aver visto i 25 valori: la quota percussiva
assoluta è piccola per tutti, e l'onset detector scatta anche sui cambi d'arco e sulle sillabe del coro).

Ricette (da `PROGETTO.md`): rosa lento, maggiore, legato, timbro caldo · alloro moderato (84–120), maggiore,
pizzicato · cipresso lento, minore, grave, legato · salvia poche note, registro alto, molto spazio · mirra lento,
modo ambiguo, voce sola.

## La tabella

| aria | brano | distanza (tutto / primi 20 s) | bpm catalogo (stima) | modo (r maj − r min) | registro MIDI | centroide Hz | attacchi/s | percussivo | spazio | polifonia | LUFS / LRA | esito |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| rosa | Simple Duet | 0.0 / 0.0 | 57 (96) | C maggiore (+0.16) | 63.2 | 1224 | 1.44 | 0.017 | 0.043 | 0.807 | -19.0 / 8.8 | tenuto |
| rosa | Morning | 0.0 / 0.1 | 60 (118) | A maggiore (+0.16) | 53.5 | 778 | 2.09 | 0.021 | 0.021 | 0.726 | -18.0 / 3.6 | scartato: chitarra e arpa pizzicate, lo stesso timbro dell'alloro |
| rosa | Reawakening | 0.23 / 0.0 | 56 (144) | C maggiore (+0.03) | 53.9 | 564 | 0.47 | 0.018 | 0.33 | 0.723 | -34.6 / 16.4 | **provvisorio** |
| rosa | Ever Mindful | 1.0 / 1.28 | 40 (123) | C maggiore (+0.12) | 44.0 | 901 | 1.03 | 0.004 | 0.022 | 0.67 | -22.3 / 5.3 | scartato: registro basso |
| rosa | Water Lily | 1.47 / 0.0 | 62 (118) | Bb maggiore (+0.22) | 42.1 | 413 | 0.78 | 0.011 | 0.199 | 0.743 | -27.6 / 8.9 | tenuto |
| alloro | Cello Suite #1 in G - Prelude | 0.0 / 0.0 | 88 (99) | D maggiore (+0.25) | 65.0 | 1543 | 4.99 | 0.041 | 0.059 | 0.832 | -15.5 / 3.9 | tenuto |
| alloro | Errigal | 0.0 / 0.0 | 112 (162) | C maggiore (+0.20) | 64.7 | 1479 | 2.08 | 0.047 | 0.09 | 0.852 | -16.8 / 3.1 | **provvisorio** |
| alloro | Somewhere Sunny (ver 2) | 0.0 / 0.0 | 106 (108) | C maggiore (+0.36) | 57.8 | 921 | 3.59 | 0.033 | 0.044 | 0.823 | -16.9 / 4.0 | tenuto |
| alloro | Evening | 0.84 / 0.78 | 101 (129) | E maggiore (+0.36) | 55.9 | 719 | 1.81 | 0.024 | 0.005 | 0.742 | -13.4 / 4.2 | scartato: legato, pochi attacchi |
| alloro | Midnight Tale | 1.91 / 2.23 | 73 (144) | A maggiore (+0.06) | 52.3 | 622 | 2.89 | 0.025 | 0.04 | 0.716 | -17.5 / 5.2 | scartato: 73 bpm, registro basso |
| cipresso | Heart of Nowhere | 0.0 / 0.0 | 47 (123) | F# minore (-0.07) | 40.4 | 639 | 2.69 | 0.003 | 0.044 | 0.69 | -19.3 / 7.4 | **provvisorio** |
| cipresso | Night Vigil | 1.3 / 3.34 | 54 (112) | A minore (-0.28) | 48.1 | 1058 | 4.04 | 0.008 | 0.076 | 0.85 | -14.3 / 12.6 | tenuto |
| cipresso | Dissappointment | 2.71 / 3.27 | 67 (123) | D maggiore (+0.24) | 47.9 | 713 | 0.78 | 0.01 | 0.036 | 0.76 | -13.1 / 4.8 | scartato: misurato maggiore |
| cipresso | Lost Time | 3.99 / 2.75 | 55 (123) | G minore (-0.26) | 45.2 | 779 | 6.19 | 0.008 | 0.005 | 0.723 | -17.0 / 5.0 | scartato: 6 attacchi/s (tremolo) |
| cipresso | Agnus Dei X | 4.39 / 4.0 | 60 (123) | C maggiore (+0.17) | 39.6 | 1153 | 0.5 | 0.049 | 0.131 | 0.8 | -14.5 / 11.6 | scartato: misurato maggiore |
| salvia | Fairytale Waltz | 0.0 / 0.0 | — (112) | C minore (-0.23) | 73.0 | 1250 | 1.91 | 0.005 | 0.123 | 0.657 | -29.6 / 7.1 | **provvisorio** |
| salvia | Wizardtorium | 1.88 / 5.62 | 58 (118) | E minore (-0.07) | 69.4 | 1610 | 1.33 | 0.006 | 0.006 | 0.742 | -37.0 / 6.4 | tenuto |
| salvia | Ethereal Relaxation | 3.96 / 4.38 | — (129) | D maggiore (+0.15) | 55.2 | 398 | 1.22 | 0.006 | 0.012 | 0.725 | -19.2 / 13.8 | scartato: registro basso, nessuno spazio |
| salvia | That Zen Moment | 6.41 / 6.53 | — (123) | A maggiore (+0.31) | 45.0 | 719 | 1.22 | 0.025 | 0.017 | 0.793 | -19.3 / 8.1 | scartato: registro basso, nessuno spazio |
| salvia | Wood and Metal and Water | 6.9 / 13.93 | — (123) | F# maggiore (+0.12) | 43.2 | 799 | 0.11 | 0.004 | 0.015 | 0.695 | -25.2 / 9.3 | scartato: registro basso, nessuno spazio |
| mirra | Mourning Song | 0.0 / 0.0 | 57 (129) | A maggiore (+0.08) | 44.6 | 640 | 1.52 | 0.001 | 0.162 | 0.551 | -18.6 / 15.0 | **provvisorio** |
| mirra | Plaint | 0.5 / 0.07 | 65 (129) | A minore (-0.17) | 61.6 | 666 | 1.73 | 0.003 | 0.013 | 0.698 | -21.4 / 5.5 | tenuto |
| mirra | Virtutes Instrumenti | 0.75 / 3.63 | 56 (123) | D maggiore (+0.03) | 67.7 | 1369 | 3.58 | 0.002 | 0.031 | 0.751 | -16.6 / 11.3 | tenuto |
| mirra | Nu Flute | 0.88 / 0.0 | 60 (123) | C maggiore (+0.18) | 54.5 | 965 | 1.36 | 0.006 | 0.087 | 0.764 | -13.2 / 9.2 | scartato: maggiore netto, non ambiguo |
| mirra | Virtutes Vocis | 3.64 / 3.12 | 56 (123) | E maggiore (+0.05) | 60.6 | 1040 | 5.91 | 0.002 | 0.012 | 0.68 | -18.7 / 6.0 | scartato: 6 attacchi/s (melismi), lontano dalla ricetta |

La stima di tempo di librosa sbaglia spesso (raddoppia, o resta sul suo valore di partenza, 123): per questo la
ricetta usa i bpm dichiarati dall'autore quando ci sono.

## Scelta provvisoria (in `src/data/rite.js`, `provisional: true`)

| aria | brano | perché |
|---|---|---|
| rosa | Reawakening (pianoforte e violoncello) | in ricetta; il timbro più caldo (centroide 564 Hz) e il più lontano dalle altre arie |
| alloro | Errigal (salterio a percussione) | in ricetta: 112 bpm, maggiore, la quota percussiva più alta |
| cipresso | Heart of Nowhere (coro, violoncelli, contrabbassi) | l'unico in ricetta su tutto: minore, grave (registro 40), legato |
| salvia | Fairytale Waltz (celesta, oboe, violoncello) | in ricetta: registro alto (73), spazio 0,12 |
| mirra | Mourning Song (oboe solo su archi gravi) | in ricetta: modo ambiguo (+0,08), una voce sola (polifonia 0,55, la più bassa), molto spazio |

Distanza a coppie tra le cinque scelte (misure normalizzate su tutti i candidati; più alto = più lontani):

```
                rosa    alloro  cipresso    salvia     mirra
rosa            0.00      5.71      4.53      5.04      3.84
alloro          5.71      0.00      5.97      4.96      6.79
cipresso        4.53      5.97      0.00      4.82      2.90
salvia          5.04      4.96      4.82      0.00      4.73
mirra           3.84      6.79      2.90      4.73      0.00
```

Le tre arie di partenza (rosa, alloro, cipresso) stanno tutte sopra 4,5. La coppia più vicina è cipresso–mirra
(2,9: tutte e due lente e gravi); è la prima da guardare nella prova alla cieca. Con Simple Duet al posto di
Reawakening la rosa si avvicina all'alloro (3,2): per questo ho preferito Reawakening, che però è il più quieto
all'inizio (LRA 16): normalizzato a −24 LUFS come il resto, ma il suo primo minuto resta piano.

## I file

- `public/rite/music/<aria>.mp3`: il brano intero (al massimo 180 s) dopo il silenzio iniziale, −24 LUFS come
  la musica del gioco (misurati −24,4/−24,5), 1 s di entrata, 3 s di uscita, stereo 44,1 kHz 80 kbit/s come
  `public/music/`. Entra sempre dall'inizio (`top: true` in `tracks.js`, mai il seek) e quando finisce riparte.
- `public/rite/cand/<codice>.mp3`: i 13 candidati tenuti, 20 s ciascuno, −24 LUFS, per la pagina d'ascolto; i codici
  sono lettere a caso, la chiave è solo in `scripts/audio/ascolto-key.json` (non pubblicata).
- `public/rite/notes/*.mp3`: le cinque note e il gong, −20 LUFS, mono 96 kbit/s.
- Rifare tutto: `scripts/audio/fetch-rite.sh`, `scripts/audio/encode-rite.sh`, `python3 -I scripts/audio/notes.py <dir Iowa> public/rite/notes`,
  `python3 -I scripts/audio/measure.py /tmp/rite-dl/raw --json notes/rito/musica.measure.json`.

## La prova alla cieca

`<sito>/ascolto/` (nel build come `ascolto/`, `noindex`; in sviluppo `/ascolto/`): 13 brani in ordine casuale, senza
nome; per ognuno «A quale aria la daresti?» (cinque riquadri di colore e fumo con una parola: tenerezza, slancio,
gravità, chiarezza, veglia) e «Ti piace?». Le risposte restano salvate nel telefono (si può chiudere e riaprire la pagina);
alla fine un codice da copiare. `node scripts/audio/ascolto-decode.mjs <codice> [<codice>…]` stampa per ognuno le
risposte, la tabella di confusione e, per aria, i brani in ordine (riconosciuto prima, poi piaciuto). Se un brano
diverso vince, si cambia la riga in `encode-rite.sh` (sezione «provisional winners»), si rifà l'encode e si toglie
`provisional` in `src/data/rite.js`.
