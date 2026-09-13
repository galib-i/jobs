import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import wails from "@wailsio/runtime/plugins/vite";
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), svelte(), wails("./bindings")],
  resolve: {
    alias: {
      $lib: resolve("./src/lib"),
    },
  },
  server: {
    host: "127.0.0.1",
    port: Number(process.env.WAILS_VITE_PORT) || 9245,
    strictPort: true,
  },
});
