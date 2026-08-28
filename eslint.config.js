// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const prettierRecommended = require('eslint-plugin-prettier/recommended');
const importPlugin = require('eslint-plugin-import');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling'],
            'index',
            'object',
            'type',
          ],
          'newlines-between': 'always', // Enforces blank lines between groups
          alphabetize: {
            order: 'asc', // Sort alphabetically in ascending order
            caseInsensitive: true, // Ignore case sensitivity
          },
        },
      ],
      'import/no-duplicates': 'error',
      // ---------
      // re-enable these at some point
      // ---------
      '@typescript-eslint/no-explicit-any': 'off',
      'no-prototype-builtins': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      'no-useless-escape': 'off',
      '@angular-eslint/no-output-on-prefix': 'off',
      '@angular-eslint/no-output-native': 'off',
      '@angular-eslint/no-uncalled-signals': 'error',
      'import/no-unresolved': 'off',
      'import/no-named-as-default-member': 'off',
    },
    settings: {
      'import/resolver': 'typescript',
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      // ---------
      // re-enable these at some point
      // ---------
      '@angular-eslint/template/click-events-have-key-events': 'off',
      '@angular-eslint/template/interactive-supports-focus': 'off',
      '@angular-eslint/template/alt-text': 'off',
      '@angular-eslint/template/no-negated-async': 'off',
      '@angular-eslint/template/mouse-events-have-key-events': 'off',
      '@angular-eslint/template/label-has-associated-control': 'off',
      '@angular-eslint/template/no-interpolation-in-attributes': 'error',
    },
  },
  {
    files: ['**/*'],
    extends: [prettierRecommended],
    rules: {
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
        },
        {},
      ],
    },
  },
);
