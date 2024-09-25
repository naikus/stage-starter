/* global __dirname */
/* global process */
import path, {resolve} from "path";
import {defineConfig} from "vite";
import solid from "vite-plugin-solid";
import legacy from "@vitejs/plugin-legacy";


// https://vitejs.dev/config/
const APP_BRANDING = process.env.APP_BRANDING || "default";

export default defineConfig({
  root: "./src",
  publicDir: "../public",
  envDir: "../",
  envPrefix: "APP_",
  define: {
    __APP_BRANDING__: JSON.stringify("default")
  },
  resolve: {
    alias: {
      "@less": resolve(__dirname, "src/less"),
      "@components": resolve(__dirname, "src/components"),
      "@lib": resolve(__dirname, "src/lib"),
      "@branding": resolve(__dirname, `src/branding/${APP_BRANDING}`),
      "@node_modules": resolve(__dirname, "node_modules"),
      "@config": resolve(__dirname, "src/config")
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        globalVars: {
          branding: APP_BRANDING
        }
      }
    }
  },
  plugins: [
    solid(),
    legacy({
      targets: ["defaults", "IE 11"]
    })
  ],
  build: {
    outDir: "../dist"
  }
});
