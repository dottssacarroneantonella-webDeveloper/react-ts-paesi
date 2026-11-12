import type { ChangeEvent } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Campo di ricerca "controllato": il valore mostrato arriva sempre dalle props (stato del genitore)
 * e ogni modifica viene comunicata al genitore tramite onChange.
 */
export function SearchBar({ value, onChange }: SearchBarProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value);
  }

  return (
    <div className="control">
      <label htmlFor="search">Cerca per nome o capitale</label>
      <input
        id="search"
        type="search"
        placeholder="Es. Italia, Roma…"
        autoComplete="off"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}
