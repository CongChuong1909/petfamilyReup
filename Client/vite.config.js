import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dns from 'dns';
import path from "path";

const commonConfig = {
  // Cấu hình chung
  plugins: [react()],
  server: {
    host: "localhost",
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
};

dns.setDefaultResultOrder('verbatim');

export default defineConfig(commonConfig);