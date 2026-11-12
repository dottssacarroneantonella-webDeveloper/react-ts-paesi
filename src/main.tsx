import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Elemento #root non trovato in index.html');
}

// StrictMode, solo in sviluppo, esegue due volte effetti e render per scoprire bug:
// per questo la richiesta all'API può comparire due volte negli strumenti del browser.
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
