import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['tests/**/*.{ts,js}', 'fixtures/**/*.{ts,js}'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      // "playwright/no-standalone-expect": ["error", { "customTestNames": ["setup"] }] // This rule is now handled by a specific override
    },
  },
  {
    rules: {
      'no-console': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'playwright/no-networkidle': 'off',
    },
  },
  {
    files: ['tests/setup/auth.setup.ts'],
    rules: {
      'playwright/no-standalone-expect': 'off',
    },
  },
  {
    ignores: ['playwright-report/', 'test-results/', 'playwright/.auth/'],
  },
];
