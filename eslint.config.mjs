import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "plugin:@typescript-eslint/recommended", "prettier"),
  {
    plugins: {
      "@typescript-eslint": (await import("@typescript-eslint/eslint-plugin")).default,
      prettier: (await import("eslint-plugin-prettier")).default,
      react: (await import("eslint-plugin-react")).default,
    },
    rules: {
      "prettier/prettier": "error",
      "react/jsx-sort-props": [
        "error",
        {
          callbacksLast: true,
          shorthandFirst: true,
          ignoreCase: true,
          reservedFirst: true,
          multiline: "last",
        },
      ],
      "react/jsx-curly-brace-presence": ["error", { props: "never", children: "never" }],
      "react/self-closing-comp": ["error", { component: true, html: true }],
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "react-hooks/rules-of-hooks": "off",
    },
  },
];

export default eslintConfig;
