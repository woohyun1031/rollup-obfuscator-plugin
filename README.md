# rollup-obfuscator-plugin

A Vite/Rollup plugin for JavaScript obfuscation using [javascript-obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator).

> **Why this plugin?** The official [rollup-plugin-javascript-obfuscator](https://github.com/javascript-obfuscator/rollup-plugin-javascript-obfuscator) hasn't been properly maintained and updated, so I created this as a modern alternative that works with current versions of Vite and Rollup.

## Installation

```bash
npm install rollup-obfuscator-plugin --save-dev
```

## Usage

### Vite

```javascript
// vite.config.js
import { defineConfig } from "vite";
import obfuscator from "rollup-obfuscator-plugin";

export default defineConfig({
  plugins: [
    obfuscator({
      compact: true,
      controlFlowFlattening: true,
    }),
  ],
});
```

### Rollup

```javascript
// rollup.config.js
import obfuscator from "rollup-obfuscator-plugin";

export default {
  input: "src/index.js",
  output: {
    file: "dist/bundle.js",
    format: "cjs",
  },
  plugins: [
    obfuscator({
      compact: true,
      controlFlowFlattening: true,
    }),
  ],
};
```

## Configuration

The plugin accepts all options from [javascript-obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator#options).

### Recommended Settings

```javascript
obfuscator({
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4,
  stringArray: true,
  stringArrayThreshold: 0.75,
  stringArrayEncoding: ["base64"],
});
```

### Source Map Support

```javascript
obfuscator({
  sourceMap: true,
  sourceMapMode: "separate", // or 'inline'
});
```

## Performance Note

⚠️ High obfuscation settings can impact build time and runtime performance. Use obfuscation only in production builds and test thoroughly.

## License

MIT

## Credits

This plugin wraps [javascript-obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator).
