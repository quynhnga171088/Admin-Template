import js from '@eslint/js'
import globals from 'globals'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules', 'coverage', '*.min.js']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      react: reactPlugin,
    },
    languageOptions: {
      globals: globals.browser,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // ─── TypeScript ───────────────────────────────────────────────────────────
      '@typescript-eslint/await-thenable': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/restrict-plus-operands': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // ─── React ────────────────────────────────────────────────────────────────
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-no-target-blank': 'off',
      'react/no-unescaped-entities': 'off',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-useless-fragment': 'warn',
      'react/self-closing-comp': ['warn', { component: true, html: true }],
      'react/no-array-index-key': 'warn',

      // ─── Formatting ───────────────────────────────────────────────────────────
      indent: [
        'error',
        2,
        {
          SwitchCase: 1,
          VariableDeclarator: 1,
          MemberExpression: 1,
          FunctionDeclaration: { parameters: 1, body: 1 },
          FunctionExpression: { parameters: 1, body: 1 },
        },
      ],
      quotes: ['error', 'single', { allowTemplateLiterals: true }],
      semi: ['error', 'always'],
      'comma-spacing': ['error', { before: false, after: true }],
      'comma-style': ['error', 'last'],
      'comma-dangle': ['error', 'never'],
      'key-spacing': ['error', { beforeColon: false, afterColon: true }],
      'max-len': ['error', { code: 180, tabWidth: 2, ignoreUrls: true }],
      'object-curly-spacing': ['error', 'always'],
      'space-in-parens': ['error', 'never'],
      'space-before-blocks': 'error',
      'space-before-function-paren': ['error', { named: 'never', asyncArrow: 'always' }],
      'space-infix-ops': 'error',
      'arrow-spacing': ['error', { before: true, after: true }],
      'arrow-parens': ['error', 'as-needed'],
      'brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'lines-between-class-members': ['error', 'always'],
      'func-call-spacing': ['error', 'never'],
      'no-multi-spaces': ['error', { ignoreEOLComments: false }],
      'no-trailing-spaces': 'error',
      'no-whitespace-before-property': 'error',
      'no-irregular-whitespace': 'error',
      'spaced-comment': 'off',

      // ─── Best Practices ───────────────────────────────────────────────────────
      'prefer-const': 'error',
      camelcase: 'off',
      eqeqeq: ['error', 'always'],
      complexity: ['error', 110],
      'default-case': 'error',
      'guard-for-in': 'error',
      radix: 'error',
      'no-bitwise': 'error',
      'no-caller': 'error',
      'no-console': 'error',
      'no-debugger': 'warn',
      'no-eval': 'warn',
      'no-case-declarations': 'off',
      'no-empty': 'off',
      'no-empty-pattern': 'off',
      'no-restricted-imports': 'off',
      'no-shadow-restricted-names': 'error',
      'no-compare-neg-zero': 'error',
      'no-cond-assign': 'error',
      'no-magic-numbers': 'off',
      'no-const-assign': 'error',
      'no-constant-condition': 'error',
      'no-control-regex': 'error',
      'no-dupe-keys': 'error',
      'no-duplicate-imports': 'error',
      'no-duplicate-case': 'error',
      'no-invalid-this': 'off',
      'no-useless-escape': 'off',
      'no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],
      'array-bracket-spacing': 'off',
    },
  },
])
