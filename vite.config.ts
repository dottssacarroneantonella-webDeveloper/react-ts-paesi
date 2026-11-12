import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configurazione di Vite: il plugin React abilita JSX/TSX e l'aggiornamento a caldo (HMR).
export default defineConfig({
  plugins: [react()],
});
