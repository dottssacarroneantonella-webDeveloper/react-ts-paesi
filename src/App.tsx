import { useMemo, useState } from 'react';
import { CountryList } from './components/CountryList';
import { RegionFilter } from './components/RegionFilter';
import { SearchBar } from './components/SearchBar';
import { SortSelect } from './components/SortSelect';
import { StatusMessage } from './components/StatusMessage';
import { useCountries } from './hooks/useCountries';
import type { Country, RegionFilterValue, SortKey } from './types/country';
import { filterAndSortCountries } from './utils/filterCountries';
import './App.css';

/** Array vuoto costante: evita di crearne uno nuovo a ogni render. */
const NO_COUNTRIES: Country[] = [];

export default function App() {
  // 1. Dati remoti, gestiti dall'hook personalizzato.
  const { state, reload } = useCountries();

  // 2. Stato dei controlli: è lo stato "sorgente" scelto dall'utente.
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState<RegionFilterValue>('all');
  const [sort, setSort] = useState<SortKey>('name-asc');

  const allCountries = state.status === 'success' ? state.countries : NO_COUNTRIES;

  // 3. Stato "derivato": non lo salviamo in useState, lo calcoliamo dai dati e dai filtri.
  //    useMemo ripete il calcolo solo quando cambia una delle dipendenze.
  const visibleCountries = useMemo(
    () => filterAndSortCountries(allCountries, { query, region, sort }),
    [allCountries, query, region, sort],
  );

  function resetFilters() {
    setQuery('');
    setRegion('all');
    setSort('name-asc');
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1>Paesi del mondo</h1>
        <p className="app__subtitle">
          Dati dall'API pubblica REST Countries · React + TypeScript
        </p>
      </header>

      <main>
        <section className="toolbar" aria-label="Filtri">
          <SearchBar value={query} onChange={setQuery} />
          <RegionFilter value={region} onChange={setRegion} />
          <SortSelect value={sort} onChange={setSort} />
          <button type="button" className="toolbar__reset" onClick={resetFilters}>
            Azzera filtri
          </button>
        </section>

        {state.status === 'loading' && (
          <StatusMessage kind="loading" message="Caricamento dei Paesi in corso…" />
        )}

        {state.status === 'error' && (
          <StatusMessage
            kind="error"
            message={`Impossibile caricare i dati. ${state.message}`}
            onRetry={reload}
          />
        )}

        {state.status === 'success' && (
          <>
            <p className="result-count" aria-live="polite">
              {visibleCountries.length} {visibleCountries.length === 1 ? 'Paese' : 'Paesi'} su{' '}
              {allCountries.length}
            </p>

            {visibleCountries.length > 0 ? (
              <CountryList countries={visibleCountries} />
            ) : (
              <StatusMessage
                kind="empty"
                message="Nessun Paese corrisponde ai filtri selezionati."
              />
            )}
          </>
        )}
      </main>

      <footer className="app__footer">
        <p>
          Progetto di Antonella Carrone ·{' '}
          <a href="https://restcountries.com" target="_blank" rel="noreferrer">
            REST Countries
          </a>
        </p>
      </footer>
    </div>
  );
}
