import type { ChangeEvent } from 'react';
import type { SortKey } from '../types/country';

interface SortSelectProps {
  value: SortKey;
  onChange: (value: SortKey) => void;
}

/** Opzioni di ordinamento: l'oggetto è tipizzato, quindi non si può dimenticare un criterio. */
const SORT_OPTIONS: Record<SortKey, string> = {
  'name-asc': 'Nome (A → Z)',
  'name-desc': 'Nome (Z → A)',
  'population-desc': 'Popolazione (più alta)',
  'population-asc': 'Popolazione (più bassa)',
};

function isSortKey(value: string): value is SortKey {
  return value in SORT_OPTIONS;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const selected = event.target.value;
    if (isSortKey(selected)) {
      onChange(selected);
    }
  }

  return (
    <div className="control">
      <label htmlFor="sort">Ordina per</label>
      <select id="sort" value={value} onChange={handleChange}>
        {(Object.keys(SORT_OPTIONS) as SortKey[]).map((key) => (
          <option key={key} value={key}>
            {SORT_OPTIONS[key]}
          </option>
        ))}
      </select>
    </div>
  );
}
