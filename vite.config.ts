import { cloudflare } from "@cloudflare/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), cloudflare()],
  optimizeDeps: {
    exclude: [
      "@cloudflare/shell",
      "@cloudflare/shell/git",
      "@cloudflare/think/tools/execute",
      "@cloudflare/think/tools/workspace",
    ],
  },
});