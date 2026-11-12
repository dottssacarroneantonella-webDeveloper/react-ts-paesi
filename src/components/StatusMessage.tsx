interface StatusMessageProps {
  kind: 'loading' | 'error' | 'empty';
  message: string;
  /** Facoltativo: se presente, mostra il pulsante "Riprova". */
  onRetry?: () => void;
}

/**
 * Messaggio per gli stati diversi dalla lista: caricamento, errore, nessun risultato.
 * role="alert" fa leggere subito gli errori agli screen reader; role="status" è più discreto.
 */
export function StatusMessage({ kind, message, onRetry }: StatusMessageProps) {
  return (
    <div className={`status status--${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
      {kind === 'loading' && <span className="spinner" aria-hidden="true" />}
      <p>{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry}>
          Riprova
        </button>
      )}
    </div>
  );
}
