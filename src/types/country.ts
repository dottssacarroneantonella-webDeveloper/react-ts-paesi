/**
 * Tipi del dominio dell'applicazione.
 *
 * Teniamo separati due modelli:
 * - ApiCountry: la forma "grezza" dei dati così come arrivano dall'API REST Countries;
 * - Country: la forma "pulita" che usano i componenti React.
 * In questo modo, se l'API cambia, va aggiornata solo la funzione di conversione in api/countries.ts.
 */

/** Elenco delle regioni restituite dall'API. `as const` lo rende una tupla di stringhe letterali. */
export const REGIONS = ['Africa', 'Americas', 'Antarctic', 'Asia', 'Europe', 'Oceania'] as const;

/** Union type ricavato dall'array: 'Africa' | 'Americas' | 'Antarctic' | 'Asia' | 'Europe' | 'Oceania'. */
export type Region = (typeof REGIONS)[number];

/** Valore del filtro regione: una regione specifica oppure tutte. */
export type RegionFilterValue = Region | 'all';

/** Criteri di ordinamento disponibili. */
export type SortKey = 'name-asc' | 'name-desc' | 'population-desc' | 'population-asc';

/** Etichette in italiano per le regioni, usate nell'interfaccia. */
export const REGION_LABELS: Record<Region, string> = {
  Africa: 'Africa',
  Americas: 'Americhe',
  Antarctic: 'Antartide',
  Asia: 'Asia',
  Europe: 'Europa',
  Oceania: 'Oceania',
};

/** Forma dei dati restituiti dall'endpoint /v3.1/all con i campi richiesti. */
export interface ApiCountry {
  cca3: string;
  name: {
    common: string;
    official: string;
  };
  capital?: string[];
  region: string;
  population: number;
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
}

/** Modello usato dall'interfaccia. */
export interface Country {
  /** Codice ISO 3166-1 alpha-3, unico: lo usiamo come `key` nelle liste. */
  code: string;
  name: string;
  officialName: string;
  capitals: string[];
  region: Region;
  population: number;
  flagUrl: string;
  flagAlt: string;
}
