# Paesi del mondo – React + TypeScript

Mini applicazione web che scarica l'elenco dei Paesi dall'API pubblica **[REST Countries](https://restcountries.com)** e lo mostra in una **lista filtrabile e ordinabile**.

Realizzata come progetto di portfolio frontend.

## Funzionalità

- Caricamento dei dati da un'API REST con `fetch` e `async/await`, annullabile con `AbortController`
- Ricerca per nome o capitale, senza distinzione tra maiuscole e accenti ("cote" trova "Côte d'Ivoire")
- Filtro per regione e ordinamento per nome o per popolazione
- Contatore dei risultati e pulsante "Azzera filtri"
- Stati gestiti: caricamento, errore con pulsante "Riprova", nessun risultato
- Layout responsive mobile-first con CSS Grid
- Accessibilità: etichette collegate ai campi, testo alternativo delle bandiere, focus visibile da tastiera, messaggi letti dagli screen reader

## Tecnologie

| Tecnologia | Uso |
| --- | --- |
| React 19 | interfaccia a componenti, hook (`useState`, `useEffect`, `useMemo`, `useCallback`) |
| TypeScript (strict) | tipi del dominio, props tipizzate, union type, type guard |
| Vite | server di sviluppo e build di produzione |
| CSS | variabili CSS, Grid, Flexbox, media query |

## Avvio in locale

Prerequisiti: [Node.js](https://nodejs.org) versione LTS (20 o successiva) e Git.

```bash
git clone https://github.com/dottssacarroneantonella-webDeveloper/react-ts-paesi.git
cd react-ts-paesi
npm install
npm run dev
```

Poi apri nel browser l'indirizzo mostrato nel terminale (di solito `http://localhost:5173`).

| Comando | Cosa fa |
| --- | --- |
| `npm run dev` | avvia il server di sviluppo con aggiornamento automatico |
| `npm run build` | controlla i tipi e crea la versione ottimizzata in `dist/` |
| `npm run preview` | serve in locale la build di `dist/` |
| `npm run typecheck` | esegue solo il controllo dei tipi TypeScript (`tsc -b`) |

## Struttura del progetto

```text
src/
├── api/countries.ts           # chiamata all'API e conversione dei dati
├── hooks/useCountries.ts      # hook personalizzato: caricamento, errore, riprova
├── utils/filterCountries.ts   # filtro e ordinamento (funzione pura, facile da testare)
├── types/country.ts           # interfacce e tipi del dominio
├── components/
│   ├── SearchBar.tsx          # campo di ricerca controllato
│   ├── RegionFilter.tsx       # select delle regioni
│   ├── SortSelect.tsx         # select dell'ordinamento
│   ├── CountryList.tsx        # lista con map() e key
│   ├── CountryCard.tsx        # scheda del singolo Paese
│   └── StatusMessage.tsx      # caricamento, errore, nessun risultato
├── App.tsx                    # componente principale: stato dei filtri e composizione
├── App.css                    # stili responsive
└── main.tsx                   # punto di ingresso: monta App nel DOM
```

## Flusso dei dati

```text
REST Countries API
      │  fetch (api/countries.ts) → conversione ApiCountry → Country
      ▼
useCountries()  →  state: loading | error | success
      ▼
App.tsx  ── stato dei filtri (query, region, sort)
      │   useMemo → filterAndSortCountries()
      ▼
CountryList → CountryCard (una per Paese)
```

## Note

- In sviluppo `React.StrictMode` esegue gli effetti due volte: è normale vedere due richieste all'API negli strumenti del browser.
- L'API è pubblica e non richiede chiavi: nel progetto non ci sono credenziali.

## Licenza

Progetto a scopo didattico e di portfolio.
