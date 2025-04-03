import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import jest from "eslint-plugin-jest";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs}"] },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { files: ["**/*.test.js", "**/__tests__/**/*.js"], languageOptions: { globals: globals.jest } },
  { files: ["**/*.js"], plugins: { js, jest }, extends: ["js/recommended", "plugin:jest/recommended"] },
]);
