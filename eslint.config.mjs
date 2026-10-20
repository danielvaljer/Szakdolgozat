import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

/**
 * ESLint (flat config).
 * A Next.js 16 saját, modern konfigurációját használjuk – azért nincs `FlatCompat`,
 * mert a `eslint-config-next` 16-tól natív flat configot ad (nem régi eslintrc-stílusút).
 *
 * A projekt két saját szabálya (AGENTS.md 7. pont):
 *   - maradék `console.log` nem maradhat a kódban,
 *   - `any` típus tilos – helyette valódi típus vagy `unknown`.
 */
const config = [
  ...nextCoreWebVitals,
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "no-console": ["error", { allow: ["warn", "error"] }],
    },
  },
];

export default config;

