import nextConfig from 'eslint-config-next'
import prettierConfig from 'eslint-config-prettier'

export default [
  ...nextConfig,
  prettierConfig,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'react-hooks/incompatible-library': 'off',
    },
  },
]
