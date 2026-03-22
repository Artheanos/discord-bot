// ESLint v10+ flat config
// https://eslint.org/docs/latest/use/configure/configuration-files-new
const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const globals = require("globals");

module.exports = [
    // Global ignores (replaces ignorePatterns)
    {
        ignores: ["node_modules/", "dist/", "coverage/", "package-lock.json"],
    },

    // Apply to project source files (prevents "File ignored because no matching configuration was supplied")
    {
        files: ["**/*.{ts,tsx,js,mjs,cjs}"],

        languageOptions: {
            ecmaVersion: "latest",
            // package.json does not specify `"type": "module"`, so default Node behavior is CommonJS.
            // Keep this as "commonjs" unless you intentionally use ESM everywhere.
            sourceType: "commonjs",
            parser: tsParser,
            globals: {
                ...globals.es2022,
                ...globals.node,
            },
        },

        plugins: {
            "@typescript-eslint": tsPlugin,
        },

        rules: {
            // This rule was removed/renamed in recent @typescript-eslint versions.
            // "@typescript-eslint/no-extra-parens": "error",
            "comma-dangle": ["error", "always-multiline"],
            indent: ["error", 4],
            "keyword-spacing": ["error", { before: true }],
            "object-curly-spacing": ["error", "always"],
            "prefer-const": "error",
            quotes: ["error", "double"],
            semi: ["error", "always"],
            "space-before-function-paren": [
                "error",
                {
                    anonymous: "always",
                    asyncArrow: "always",
                    named: "never",
                },
            ],
        },
    },
];
