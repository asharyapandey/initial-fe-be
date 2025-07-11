import pluginJs from "@eslint/js";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";


export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.browser } },
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
    },
    rules: {
      "no-unused-vars": [
        "error",
        {
          "args": "all",
          "argsIgnorePattern": "^_"
        }
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "args": "all",
          "argsIgnorePattern": "^_"
        }
      ],
      "no-console": "warn",

      "@typescript-eslint/no-explicit-any": "warn",

      "no-constant-condition": ["error", { checkLoops: true }],

      "no-duplicate-imports": ["error"],
      "unused-imports/no-unused-imports": "error",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
