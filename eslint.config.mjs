import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";

export default defineConfig({
    env: {
        commonjs: true,
        es2021: true,
        node: true,
        jest: true
    },
    extends: "eslint:recommended",
    overrides: [],
    parserOptions: {
        ecmaVersion: "latest"
    },
    rules: {}
});
