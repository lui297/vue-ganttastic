import { defineConfig, normalizePath } from "vite"
import vue from "@vitejs/plugin-vue"
import * as path from "path"
import { fileURLToPath } from "url"
import { viteStaticCopy } from "vite-plugin-static-copy"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    viteStaticCopy({
      targets: [
        {
          src: normalizePath(path.resolve(__dirname, "./src/styles")),
          dest: normalizePath(path.resolve(__dirname, "./lib")),
        },
      ],
    }),
  ],
  css: {
    preprocessorOptions: {
      sass: {
        api: 'modern-compiler',
      },
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  build: {
    cssCodeSplit: true,
    target: 'esnext',
    lib: process.env.NODE_ENV === "production" ? {
      entry: fileURLToPath(
        new URL("src/vue-ganttastic.ts", import.meta.url)
      ),
      name: "VueGanttastic",
      fileName: (format) => `vue-ganttastic.${format}.js`,
      formats: ["es", "umd"],
    } : undefined,
    outDir: process.env.NODE_ENV === "production" ? "lib" : "dist",
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into the library
      external: ["vue", "luxon"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: "Vue",
          luxon: "Luxon"
        },
        exports: "named",
      }
    }
  }
})
