/// <reference types="vitest" />

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { existsSync } from "node:fs";
import path from "node:path";

const sharedPath = existsSync(path.resolve(__dirname, "shared"))
  ? path.resolve(__dirname, "shared")
  : path.resolve(__dirname, "../shared");

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@shared": sharedPath,
      axios: path.resolve(__dirname, "node_modules/axios/dist/esm/axios.js")
    }
  },

  server: {
    host: "0.0.0.0",
    port: 5173,
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
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    globals: true
  }
});