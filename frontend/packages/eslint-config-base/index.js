module.exports = {
  env: {
    browser: true,
    es2022: true,
  },
  extends: [
    "airbnb",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:prettier/recommended",
    "plugin:import/typescript",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  globals: {
    JSX: true,
  },
  overrides: [
    {
      files: ["**/*.spec.ts", "**/*.spec.tsx"],
      env: {
        jest: true
      },
    },
  ],
  plugins: ["prettier", "react", "react-hooks", "@typescript-eslint"],
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error",
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        ts: "never",
        tsx: "never",
      },
    ],
    "react/jsx-filename-extension": [
      "error",
      {
        extensions: [".tsx"],
      },
    ],
    "react/jsx-first-prop-new-line": ["error", "multiline"],
    "react/jsx-max-props-per-line": [
      "error",
      {
        maximum: 1,
        when: "always",
      },
    ],
    "react/jsx-indent-props": ["error", 2],
    "react/jsx-closing-bracket-location": ["error", "tag-aligned"],
    "react/jsx-fragments": ["error", "element"],
    "react/button-has-type": "off",
    "react/require-default-props": [
      "error",
      {
        functions: "defaultArguments",
      },
    ],
    "jsx-a11y/label-has-associated-control": [
      1,
      {
        assert: "either",
      },
    ],
    "max-len": [
      "error",
      {
        code: 100,
        tabWidth: 2,
        ignoreComments: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreUrls: true,
      },
    ],
    "no-multiple-empty-lines": [
      "error",
      {
        max: 1,
        maxEOF: 1,
        maxBOF: 0,
      },
    ],
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": ["error"],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "no-param-reassign": [
      "error",
      {
        props: false,
      },
    ],
    "no-unused-expressions": 0,
    "no-use-before-define": 0,
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "parent",
          "internal",
          "sibling",
          "index",
        ],
        alphabetize: {
          order: "asc",
          caseInsensitive: false,
        },
      },
    ],
    "import/no-extraneous-dependencies": 0,
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "args": "all",
        "argsIgnorePattern": "^_",
        "caughtErrors": "all",
        "caughtErrorsIgnorePattern": "^_",
        "destructuredArrayIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "ignoreRestSiblings": true,
      },
    ],
  },
};
