/// <reference types="vitest" />

import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import { existsSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";

const sharedPath = existsSync(path.resolve(__dirname, "shared"))
  ? path.resolve(__dirname, "shared")
  : path.resolve(__dirname, "../shared");

export default defineConfig({
  plugins: [react(), legacy()],

  resolve: {
    alias: {
      "@shared": sharedPath,
      axios: path.resolve(__dirname, "node_modules/axios/dist/esm/axios.js")
    }
  },

  server: {
    host: "0.0.0.0",
    port: 5174,
    fs: {
      allow: [path.resolve(__dirname), sharedPath]
    },
    watch: {
      usePolling: true
    }
  },

  optimizeDeps: {
    include: ["axios"]
  },

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts"
  }
});