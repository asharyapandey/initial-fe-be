import { FlatCompat } from "@eslint/eslintrc";
import eslintPluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import eslintPluginUnusedImports from "eslint-plugin-unused-imports";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      "simple-import-sort": eslintPluginSimpleImportSort,
      "unused-imports": eslintPluginUnusedImports,
    },
    rules: {
      // Simple import sort rules
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      // Unused imports
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
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
  },
];

export default eslintConfig;
