
import { FlatCompat } from "@eslint/eslintrc";
import importHelpersPlugin from "eslint-plugin-import-helpers";
import { dirname } from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  ...compat.extends("prettier"),
  {
    plugins: {
      "import-helpers": importHelpersPlugin, 
    },
    rules: {
      semi: ["error"],
      quotes: ["error", "double"],
      "prefer-arrow-callback": ["error"],
      "prefer-template": ["error"],
      "import-helpers/order-imports": [
        "warn",
        {
          newlinesBetween: "always",
          groups: [
            ["/^react/", "/^next/", "/@next/"],
            "/components/",
            "module",
            "/^@shared/",
            "/absolute/",
            ["parent", "sibling", "index"],
          ],
          alphabetize: { order: "asc", ignoreCase: true },
        },
      ],
    },
  },

];

export default eslintConfig;
