import type { ChangeEvent } from 'react';
import { REGIONS, REGION_LABELS, type RegionFilterValue } from '../types/country';

interface RegionFilterProps {
  value: RegionFilterValue;
  onChange: (value: RegionFilterValue) => void;
}

/** Type guard: il valore di una <select> è sempre una stringa, qui verifichiamo che sia ammesso. */
function isRegionFilterValue(value: string): value is RegionFilterValue {
  return value === 'all' || (REGIONS as readonly string[]).includes(value);
}

export function RegionFilter({ value, onChange }: RegionFilterProps) {
  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const selected = event.target.value;
    if (isRegionFilterValue(selected)) {
      onChange(selected);
    }
  }

  return (
    <div className="control">
      <label htmlFor="region">Regione</label>
      <select id="region" value={value} onChange={handleChange}>
        <option value="all">Tutte le regioni</option>
        {REGIONS.map((region) => (
          <option key={region} value={region}>
            {REGION_LABELS[region]}
          </option>
        ))}
      </select>
    </div>
  );
}
