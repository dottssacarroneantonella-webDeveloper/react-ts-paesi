# Paesi del mondo – React + TypeScript

Mini applicazione web che scarica l'elenco dei Paesi dall'API pubblica **[REST Countries](https://restcountries.com)** e lo mostra in una **lista filtrabile e ordinabile**.

Realizzata come progetto di portfolio frontend.

## Funzionalità

- Caricamento dei dati dall'API REST Countries v5 con `fetch` e `async/await`: autenticazione con chiave, paginazione (100 Paesi per richiesta), annullamento con `AbortController`
- Cache di un'ora in `sessionStorage`, per non consumare richieste a ogni ricarica
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

### 1. Ottieni una chiave API gratuita

L'app usa la [REST Countries API v5](https://restcountries.com/docs/countries), che richiede una chiave personale e gratuita (piano Free: 1.000 richieste al mese). Ogni persona che usa il progetto deve crearne una propria.

1. Vai su [restcountries.com/sign-up](https://restcountries.com/sign-up) e crea un account.
2. Dopo l'accesso apri la pagina **API Keys** dal menu in alto e crea una nuova chiave (**Create a new key**).
3. Compila il modulo:

   | Campo | Valore |
   | --- | --- |
   | **Label** | un nome a scelta, per esempio `react-ts-paesi locale` |
   | **Expires** | vuoto, così la chiave non scade |
   | **CORS allowed origins** | `localhost` (solo il nome: senza `http://`, senza porta, senza `/`) |

4. Clicca **Create key** e copia la chiave (inizia con `rc_live_`).

Il campo **CORS allowed origins** è indispensabile: REST Countries blocca le richieste fatte dal browser se il dominio della pagina non è nell'elenco. Senza `localhost` l'app mostra l'errore 403.

### 2. Scarica il progetto e installa le dipendenze

```bash
git clone https://github.com/dottssacarroneantonella-webDeveloper/react-ts-paesi.git
cd react-ts-paesi
npm install
```

### 3. Inserisci la chiave nel file `.env`

Il file `.env.example` è un modello. Copialo con il nome `.env`:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# macOS / Linux
cp .env.example .env
```

Apri `.env` e sostituisci il segnaposto con la tua chiave, senza spazi né virgolette:

```bash
VITE_RESTCOUNTRIES_API_KEY=rc_live_la-tua-chiave
```

Il file `.env` è escluso da Git tramite `.gitignore`: resta solo sul tuo computer e non viene mai caricato su GitHub.

### 4. Avvia l'app

```bash
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
REST Countries API v5 (chiave nel file .env)
      │  fetch paginato (api/countries.ts) → conversione ApiCountry → Country → cache
      ▼
useCountries()  →  state: loading | error | success
      ▼
App.tsx  ── stato dei filtri (query, region, sort)
      │   useMemo → filterAndSortCountries()
      ▼
CountryList → CountryCard (una per Paese)
```

## Pubblicazione online e chiave API

La chiave **non va mai scritta nel codice** né caricata su GitHub. Quando si pubblica il sito, la si inserisce nelle impostazioni del servizio di hosting, che la passa a Vite durante la build.

Prima di pubblicare, aggiungi il dominio del sito ai **CORS allowed origins** della chiave su REST Countries, separato da una virgola: per esempio `localhost, react-ts-paesi.vercel.app`.

### Vercel

1. Importa il repository su [vercel.com](https://vercel.com) (**Add New… → Project**).
2. Prima del deploy, oppure dopo nel progetto, apri **Settings → Environment Variables**.
3. Aggiungi la variabile:
   - **Key:** `VITE_RESTCOUNTRIES_API_KEY`
   - **Value:** la tua chiave
4. Salva ed esegui un nuovo deploy (**Deployments → Redeploy**): le variabili vengono lette solo durante la build.

### GitHub Pages (con GitHub Actions)

1. Nel repository apri **Settings → Secrets and variables → Actions**.
2. Clicca **New repository secret** e inserisci:
   - **Name:** `VITE_RESTCOUNTRIES_API_KEY`
   - **Secret:** la tua chiave
3. Nel file del workflow (per esempio `.github/workflows/deploy.yml`) passa il secret al passaggio di build:

```yaml
      - run: npm run build
        env:
          VITE_RESTCOUNTRIES_API_KEY: ${{ secrets.VITE_RESTCOUNTRIES_API_KEY }}
```

### Sicurezza della chiave

- Le variabili che iniziano con `VITE_` vengono inserite nel JavaScript inviato al browser: in un sito pubblicato la chiave è quindi leggibile da chi ispeziona la pagina. La protezione è il campo **CORS allowed origins**, che la rende utilizzabile solo dai domini indicati.
- Se la chiave finisce per errore in un commit, in uno screenshot o in un messaggio, revocala subito dalla pagina **API Keys** e creane una nuova.
- Se carichi file dal sito di GitHub (**Add file → Upload files**), il `.gitignore` non viene applicato: non caricare mai il file `.env`.

## Note

- In sviluppo `React.StrictMode` esegue gli effetti due volte: è normale vedere due richieste all'API negli strumenti del browser.
- Nel repository non ci sono credenziali: la chiave sta solo nel file `.env` locale o nelle impostazioni dell'hosting.
- I dati restano in cache nel browser per un'ora (`sessionStorage`), così le ricariche non consumano richieste.
- Dopo aver modificato `.env` bisogna riavviare `npm run dev`.

## Licenza

Progetto a scopo didattico e di portfolio.
