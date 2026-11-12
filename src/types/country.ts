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

/** Un Paese restituito dall'API v5, limitato ai campi richiesti con response_fields. */
export interface ApiCountry {
  uuid?: string;
  codes: {
    alpha_2?: string;
    alpha_3?: string;
  };
  names: {
    common: string;
    official: string;
  };
  capitals?: {
    name: string;
  }[];
  region: string;
  population?: number;
  flag: {
    url_svg: string;
    url_png: string;
    description?: string;
  };
}

/** Risposta dell'elenco paginato: GET /countries/v5?limit=…&offset=… */
export interface ApiListResponse {
  data: {
    objects: ApiCountry[];
    meta: {
      total: number;
      count: number;
      limit: number;
      offset: number;
      more: boolean;
    };
  };
}

/** Corpo delle risposte di errore dell'API. */
export interface ApiErrorResponse {
  errors?: {
    message: string;
    code?: string;
  }[];
}

/** Modello usato dall'interfaccia. */
export interface Country {
  /** Identificativo unico e stabile: lo usiamo come `key` nelle liste. */
  id: string;
  /** Codice ISO 3166-1 alpha-3 (vuoto per alcuni territori senza codice ISO, es. Abkhazia). */
  code: string;
  name: string;
  officialName: string;
  capitals: string[];
  region: Region;
  population: number;
  flagUrl: string;
  flagAlt: string;
}
