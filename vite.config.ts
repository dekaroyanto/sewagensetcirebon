import dns from "node:dns";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// Paksa Node.js menggunakan IPv4 terlebih dahulu agar proxy ke Hostinger tidak hang/timeout karena IPv6 ISP
dns.setDefaultResultOrder("ipv4first");

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: "https://sewagensetcirebon.com",
          changeOrigin: true,
          secure: false,
          configure: (proxy) => {
            proxy.on("error", (err, _req, res) => {
              console.warn("[Vite Proxy API Warning]:", err.message);
            });
          },
        },
        "/uploads": {
          target: "https://sewagensetcirebon.com",
          changeOrigin: true,
          secure: false,
          configure: (proxy) => {
            proxy.on("error", (err, _req, res) => {
              console.warn("[Vite Proxy Uploads Warning]:", err.message);
            });
          },
        },
      },
      hmr: process.env.DISABLE_HMR !== "true",
      watch: process.env.DISABLE_HMR === "true" ? null : {},
    },
  };
});
