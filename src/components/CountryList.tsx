import type { Country } from '../types/country';
import { CountryCard } from './CountryCard';

interface CountryListProps {
  countries: Country[];
}

/**
 * Rende la lista con map(). Ogni elemento ha una `key` stabile e unica (l'id del Paese):
 * React la usa per capire quali elementi sono cambiati tra un render e l'altro.
 */
export function CountryList({ countries }: CountryListProps) {
  return (
    <ul className="country-grid">
      {countries.map((country) => (
        <CountryCard key={country.id} country={country} />
      ))}
    </ul>
  );
}
