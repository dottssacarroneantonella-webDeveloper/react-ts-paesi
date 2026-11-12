import {
  REGIONS,
  type ApiCountry,
  type ApiErrorResponse,
  type ApiListResponse,
  type Country,
  type Region,
} from '../types/country';

/**
 * REST Countries API v5: richiede una chiave gratuita (https://restcountries.com/sign-up).
 * La chiave si legge dal file .env (vedi .env.example) e NON va scritta nel codice.
 *
 * Attenzione: le variabili VITE_* finiscono nel JavaScript scaricato dal browser, quindi
 * chiunque apra il sito può leggerle. Per questo la chiave va limitata ai propri domini
 * (pagina "API Keys" di REST Countries → allowed hostnames: localhost, il dominio pubblicato).
 */
const API_BASE_URL = 'https://api.restcountries.com/countries/v5';
const API_KEY: string | undefined = import.meta.env.VITE_RESTCOUNTRIES_API_KEY;

/** Solo i campi che servono all'interfaccia: risposta più leggera. */
const RESPONSE_FIELDS = [
  'codes.alpha_3',
  'names.common',
  'names.official',
  'capitals',
  'region',
  'population',
  'flag.url_svg',
  'flag.url_png',
  'flag.description',
].join(',');

/** Il piano gratuito restituisce al massimo 100 Paesi per richiesta: si scaricano più pagine. */
const PAGE_SIZE = 100;
/** Limite di sicurezza: con circa 250 Paesi bastano 3 pagine. */
const MAX_PAGES = 5;

/** Cache nella sessione del browser: evita di consumare richieste a ogni ricarica (piano gratuito: 1.000 al mese). */
const CACHE_KEY = 'react-ts-paesi:countries:v5';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 ora

/** Messaggi in italiano per gli errori più comuni dell'API. */
const STATUS_MESSAGES: Record<number, string> = {
  401: 'Chiave API mancante, non valida o revocata. Controlla il file .env.',
  403: 'Accesso negato: account sospeso o limite mensile superato.',
  429: 'Troppe richieste in poco tempo. Attendi qualche secondo e riprova.',
};

/** Type guard: verifica a runtime che una stringa sia una delle regioni previste. */
function isRegion(value: string): value is Region {
  return (REGIONS as readonly string[]).includes(value);
}

/** Converte un elemento grezzo dell'API nel modello usato dall'interfaccia. */
export function toCountry(raw: ApiCountry): Country | null {
  if (!isRegion(raw.region)) {
    return null; // regione sconosciuta: scartiamo il dato invece di rompere l'interfaccia
  }

  const name = raw.names.common;

  return {
    code: raw.codes.alpha_3,
    name,
    officialName: raw.names.official,
    capitals: (raw.capitals ?? []).map((capital) => capital.name),
    region: raw.region,
    population: raw.population ?? 0,
    flagUrl: raw.flag.url_svg || raw.flag.url_png,
    flagAlt: raw.flag.description || `Bandiera di ${name}`,
  };
}

function readCache(): Country[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw) as { savedAt: number; countries: Country[] };
    return Date.now() - cached.savedAt < CACHE_TTL_MS ? cached.countries : null;
  } catch {
    return null; // sessionStorage non disponibile o dato corrotto
  }
}

function writeCache(countries: Country[]): void {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), countries }));
  } catch {
    // archiviazione piena o non disponibile: si continua senza cache
  }
}

/** Scarica una pagina di risultati. */
async function fetchPage(offset: number, signal?: AbortSignal): Promise<ApiListResponse> {
  const params = new URLSearchParams({
    limit: String(PAGE_SIZE),
    offset: String(offset),
    response_fields: RESPONSE_FIELDS,
  });

  const response = await fetch(`${API_BASE_URL}?${params}`, {
    signal,
    headers: { Authorization: `Bearer ${API_KEY}` },
  });

  if (!response.ok) {
    // L'API spiega l'errore nel campo errors[0].message: lo usiamo se non abbiamo un messaggio nostro.
    const body = (await response.json().catch(() => null)) as ApiErrorResponse | null;
    const apiMessage = body?.errors?.[0]?.message;
    throw new Error(
      STATUS_MESSAGES[response.status] ??
        `Il server ha risposto con errore ${response.status}.${apiMessage ? ` ${apiMessage}` : ''}`,
    );
  }

  const data: unknown = await response.json();
  const objects = (data as ApiListResponse | null)?.data?.objects;

  if (!Array.isArray(objects)) {
    throw new Error('Formato dei dati inatteso.');
  }

  return data as ApiListResponse;
}

/**
 * Scarica l'elenco completo dei Paesi, pagina dopo pagina.
 * @param signal permette di annullare la richiesta (per esempio se il componente viene smontato).
 * @throws Error se manca la chiave, se una risposta HTTP non è 2xx o se il formato non è quello atteso.
 */
export async function fetchCountries(signal?: AbortSignal): Promise<Country[]> {
  if (!API_KEY) {
    throw new Error(
      'Manca la chiave API: crea il file .env partendo da .env.example e riavvia npm run dev.',
    );
  }

  const cached = readCache();
  if (cached) {
    return cached;
  }

  const rawCountries: ApiCountry[] = [];
  let offset = 0;

  for (let page = 0; page < MAX_PAGES; page++) {
    const { data } = await fetchPage(offset, signal);
    rawCountries.push(...data.objects);

    if (!data.meta.more) break;
    offset += data.objects.length;
  }

  const countries = rawCountries
    .map(toCountry)
    .filter((country): country is Country => country !== null);

  writeCache(countries);
  return countries;
}
