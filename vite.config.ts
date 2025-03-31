import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path, { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // ✅ alias for `@/`
    },
  },
  build: {
    rollupOptions: {
      input: {
        index: resolve(new URL(".", import.meta.url).pathname, "index.html"),
        popup: resolve(__dirname, "popup.html"),
        content: resolve(__dirname, "src/content.tsx"),
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
    outDir: "dist",
    emptyOutDir: true,
  },
});
