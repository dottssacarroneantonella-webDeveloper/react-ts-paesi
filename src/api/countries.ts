import { REGIONS, type ApiCountry, type Country, type Region } from '../types/country';

/**
 * Endpoint dell'API pubblica REST Countries (nessuna chiave richiesta).
 * Il parametro `fields` limita la risposta ai soli campi che ci servono: meno dati, risposta più veloce.
 */
export const COUNTRIES_URL =
  'https://restcountries.com/v3.1/all?fields=name,capital,region,population,flags,cca3';

/** Type guard: verifica a runtime che una stringa sia una delle regioni previste. */
function isRegion(value: string): value is Region {
  return (REGIONS as readonly string[]).includes(value);
}

/** Converte un elemento grezzo dell'API nel modello usato dall'interfaccia. */
export function toCountry(raw: ApiCountry): Country | null {
  if (!isRegion(raw.region)) {
    return null; // regione sconosciuta: scartiamo il dato invece di rompere l'interfaccia
  }

  return {
    code: raw.cca3,
    name: raw.name.common,
    officialName: raw.name.official,
    capitals: raw.capital ?? [],
    region: raw.region,
    population: raw.population,
    flagUrl: raw.flags.svg || raw.flags.png,
    flagAlt: raw.flags.alt ?? `Bandiera di ${raw.name.common}`,
  };
}

/**
 * Scarica l'elenco dei Paesi.
 * @param signal permette di annullare la richiesta (per esempio se il componente viene smontato).
 * @throws Error se la risposta HTTP non è 2xx o se il formato non è quello atteso.
 */
export async function fetchCountries(signal?: AbortSignal): Promise<Country[]> {
  const response = await fetch(COUNTRIES_URL, { signal });

  if (!response.ok) {
    throw new Error(`Il server ha risposto con errore ${response.status}.`);
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('Formato dei dati inatteso.');
  }

  return (data as ApiCountry[])
    .map(toCountry)
    .filter((country): country is Country => country !== null);
}
