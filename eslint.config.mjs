import config from '@dsrca/config/eslint/eslint.config.js';

/**
 * @type {import('eslint').ESLint.ConfigData}
 */
export default [
  ...config,
  {
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    ignores: ['.wrangler/**/*', 'dist/**/*', 'node_modules/**/*', '.DS_Store'],
  },
];
