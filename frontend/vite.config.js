import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

export default defineConfig(({ mode }) => ({
  plugins: [react()],

  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "cert/localhost-key.pem")),
      cert: fs.readFileSync(path.resolve(__dirname, "cert/localhost.pem")),
    },

    port: 5173,
    host: "localhost",

    // ONLY in dev
    proxy:
      mode === "development"
        ? {
            "/api": {
              target: "http://127.0.0.1:3000",
              changeOrigin: true,
              secure: false,
            },
          }
        : undefined,
  },
}));
