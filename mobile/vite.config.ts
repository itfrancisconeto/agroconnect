/// <reference types="vitest" />

import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), legacy()],

  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, "../shared")
    }
  },

  server: {
    host: "0.0.0.0",
    port: 5174,

    fs: {
      allow: [".."]
    },

    watch: {
      // Improves file change detection when running Vite inside Docker on Linux/WSL.
      usePolling: true
    }
  },

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts"
  }
});