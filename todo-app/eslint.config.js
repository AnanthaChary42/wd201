export default [
  {
    ignores: ["node_modules/**"],
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        __dirname: "readonly",
        __filename: "readonly",
      },
    },
    plugins: {},
    rules: {
      // Your rules here
    },
  },
  {
    files: ["**/__tests__/**/*.js"],
    languageOptions: {
      globals: {
        describe: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
      },
    },
  },
];
