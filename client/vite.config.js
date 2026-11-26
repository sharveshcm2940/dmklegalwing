import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// VITE_BASE: set to the sub-path if the site is mounted inside the main website, e.g. /legal-wing/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    base: env.VITE_BASE || '/',
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': 'http://127.0.0.1:5000',
        '/uploads': 'http://127.0.0.1:5000',
      },
    },
  };
});
