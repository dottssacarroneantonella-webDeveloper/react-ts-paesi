/// <reference types="vite/client" />

/** Variabili d'ambiente lette da Vite (file .env). Solo quelle che iniziano con VITE_ arrivano al browser. */
interface ImportMetaEnv {
  readonly VITE_RESTCOUNTRIES_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
