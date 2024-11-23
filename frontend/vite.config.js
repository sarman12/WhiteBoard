import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    global: "window", // Map Node.js global to browser's window object
  },
  optimizeDeps: {
    include: ["fabric"], // Pre-bundle Fabric.js for Vite
  },
});
