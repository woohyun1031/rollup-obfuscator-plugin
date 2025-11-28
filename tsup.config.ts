import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.js"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  external: ["javascript-obfuscator", "vite"],
});
