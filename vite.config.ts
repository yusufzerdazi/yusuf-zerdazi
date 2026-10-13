import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),svgr({
    svgrOptions: { ref: true }
  })],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        epk: resolve(__dirname, "epk/index.html"),
      },
    },
  },
});
