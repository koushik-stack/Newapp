import { defineConfig } from "vite";
import checker from "vite-plugin-checker";

export default defineConfig({
  plugins: [checker({ typescript: true })],
  worker: {},
  build: {
    sourcemap: false,
  },
  server: {
    open: true,
    port: 1234,
    host: true, // ✅ Allows access via your local network IP
  },
});
