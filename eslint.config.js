import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier";

// Flat ESLint config. The pure logic (lib/) is plain ES modules; the device app,
// the side service and the settings app run in Zepp OS runtimes that expose a
// few globals and the px() layout helper, declared below so lint does not flag
// them. Prettier owns formatting, so its config is applied last to turn off the
// stylistic rules that would fight it.
export default [
  { ignores: ["node_modules/", "dist/", "build/", "coverage/"] },

  js.configs.recommended,

  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.es2021,
        // Zepp OS device + side-service runtime globals.
        getApp: "readonly",
        getCurrentPage: "readonly",
        getDeviceInfo: "readonly",
        Logger: "readonly",
        px: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
      },
    },
  },

  // Tests and Node-side tooling run under Node/Vitest.
  {
    files: ["**/*.test.js", "*.config.js", "scripts/**/*.js"],
    languageOptions: { globals: { ...globals.node } },
  },

  prettier,
];
