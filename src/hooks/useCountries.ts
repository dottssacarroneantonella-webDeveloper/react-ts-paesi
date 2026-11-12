import { useCallback, useEffect, useState } from 'react';
import { fetchCountries } from '../api/countries';
import type { Country } from '../types/country';

/**
 * Stato della richiesta come "discriminated union": il campo `status` dice quale forma ha l'oggetto.
 * TypeScript impedisce così di leggere `countries` mentre si sta ancora caricando.
 */
export type CountriesState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; countries: Country[] };

export interface UseCountriesResult {
  state: CountriesState;
  /** Ripete la richiesta (usato dal pulsante "Riprova"). */
  reload: () => void;
}

/**
 * Hook personalizzato: incapsula il caricamento dei dati, così App.tsx resta semplice
 * e la stessa logica si può riusare in altri componenti.
 */
export function useCountries(): UseCountriesResult {
  const [state, setState] = useState<CountriesState>({ status: 'loading' });
  // Ogni incremento di `attempt` fa ripartire l'effetto, cioè una nuova richiesta.
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });

    async function load(): Promise<void> {
      try {
        const countries = await fetchCountries(controller.signal);
        setState({ status: 'success', countries });
      } catch (error: unknown) {
        // Una richiesta annullata non è un errore da mostrare all'utente.
        if (controller.signal.aborted) {
          return;
        }
        const message =
          error instanceof Error ? error.message : 'Errore sconosciuto durante il caricamento.';
        setState({ status: 'error', message });
      }
    }

    void load();

    // Funzione di cleanup: React la esegue quando il componente viene smontato
    // o prima di rieseguire l'effetto. Annulla la richiesta ancora in corso.
    return () => controller.abort();
  }, [attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  return { state, reload };
}
