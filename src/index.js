// rollup-plugin-javascript-obfuscator.js

import JavaScriptObfuscator from "javascript-obfuscator";

/**
 * @typedef {import('javascript-obfuscator').ObfuscatorOptions} ObfuscatorOptions
 * @typedef {import('vite').Plugin} Plugin
 */

/**
 * Creates a Vite/Rollup plugin for JavaScript obfuscation
 * @param {ObfuscatorOptions} [options={}] - Obfuscator options
 * @returns {Plugin} Vite/Rollup plugin
 */
export default function javascriptObfuscator(options = {}) {
  return {
    name: "javascript-obfuscator",
    // enforce: "post",
    /**
     * @param {string} code - Source code
     * @returns {{code: string, map?: string} | null} Obfuscated code with optional source map
     */
    renderChunk(code) {
      try {
        const obfuscationResult = JavaScriptObfuscator.obfuscate(code, options);

        /** @type {{code: string, map?: string}} */
        const result = {
          code: obfuscationResult.getObfuscatedCode(),
        };

        if (options.sourceMap && options.sourceMapMode !== "inline") {
          result.map = obfuscationResult.getSourceMap();
        }

        return result;
      } catch (error) {
        console.error("[Obfuscator Error]", error);
        return null;
      }
    },
  };
}
