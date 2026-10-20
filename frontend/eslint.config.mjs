import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";
import tseslint from "typescript-eslint";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
  },
  { rules: jsxA11y.flatConfigs.strict.rules },
  { files: ["**/*.mjs"], extends: [tseslint.configs.disableTypeChecked] },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
