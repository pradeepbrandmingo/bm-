import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ["defaults", "not IE 11", "ios >= 11"],
    }),
  ],
  build: {
    cssTarget: "safari12",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("react-router-dom")
            ) {
              return "vendor";
            }
            if (
              id.includes("framer-motion") ||
              id.includes("gsap") ||
              id.includes("aos")
            ) {
              return "animations";
            }
          }
        },
      },
    },
  },
});
