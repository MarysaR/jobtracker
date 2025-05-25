import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Ignore les erreurs TypeScript pendant le build
      onwarn: () => {},
    },
  },
  // Force Vite à ignorer certaines vérifications TS
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },
});
