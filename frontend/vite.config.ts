/// <reference types="vitest" />

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, "../shared")
    }
  },

  server: {
    host: "0.0.0.0",
    port: 5173,

    fs: {
      allow: [".."]
    },

    watch: {
      // Improves file change detection when running Vite inside Docker on Linux/WSL.
      usePolling: true
    }
  },

  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    globals: true
  }
});