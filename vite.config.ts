import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      __APP_ENV__: env.APP_ENV,
    },
    plugins: [react()],
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: "globalThis",
        },
        plugins: [NodeGlobalsPolyfillPlugin({ process: true, buffer: true })],
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            const isModule = id.includes("node_modules");
            if (isModule && id.includes("@solana")) {
              return "vendor_solana";
            }
            if (isModule && id.includes("@project-serum")) {
              return "vendor_anchor";
            }
            if (isModule && id.includes("@metaplex-foundation")) {
              return "vendor_metaplex";
            }
            if (isModule && id.includes("@tanstack")) {
              return "vendor_tanstack";
            }
          },
        },
      },
    },
    server: {
      port: 9933,
    },
  };
});
