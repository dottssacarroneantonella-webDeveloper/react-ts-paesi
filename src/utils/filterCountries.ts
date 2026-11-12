import type { Country, RegionFilterValue, SortKey } from '../types/country';

/** Criteri scelti dall'utente nei controlli della pagina. */
export interface CountryFilters {
  query: string;
  region: RegionFilterValue;
  sort: SortKey;
}

/** Rende il confronto indipendente da maiuscole e accenti: "Città" e "citta" coincidono. */
export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

/** Restituisce true se il nome o una delle capitali contengono il testo cercato. */
function matchesQuery(country: Country, normalizedQuery: string): boolean {
  if (normalizedQuery === '') {
    return true;
  }
  const searchable = [country.name, country.officialName, ...country.capitals];
  return searchable.some((value) => normalizeText(value).includes(normalizedQuery));
}

/** Funzione di confronto per Array.prototype.sort, scelta in base al criterio. */
function compareBy(sort: SortKey): (a: Country, b: Country) => number {
  switch (sort) {
    case 'name-asc':
      return (a, b) => a.name.localeCompare(b.name, 'it');
    case 'name-desc':
      return (a, b) => b.name.localeCompare(a.name, 'it');
    case 'population-desc':
      return (a, b) => b.population - a.population;
    case 'population-asc':
      return (a, b) => a.population - b.population;
  }
}

/**
 * Funzione "pura": stessi input, stesso output, nessun effetto collaterale.
 * Non modifica l'array originale (lo stato React non va mai mutato): filter crea già un nuovo array.
 */
export function filterAndSortCountries(countries: Country[], filters: CountryFilters): Country[] {
  const normalizedQuery = normalizeText(filters.query);

  return countries
    .filter((country) => filters.region === 'all' || country.region === filters.region)
    .filter((country) => matchesQuery(country, normalizedQuery))
    .sort(compareBy(filters.sort));
}
