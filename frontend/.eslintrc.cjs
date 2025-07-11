module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh", "unused-imports", "simple-import-sort"],
  rules: {
    "react-refresh/only-export-components": [
      "allow",
      { allowConstantExport: true },
    ],
    "simple-import-sort/imports": ["error"],
    "unused-imports/no-unused-imports": ["error"],
    "no-unused-vars": [
      "error",
      {
        caughtErrors: "none",
      },
    ],
    "no-console": [
      "error",
      {
        allow: ["warn", "error"],
      },
    ],
  },
};
