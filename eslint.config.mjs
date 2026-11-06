import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

// Parity with CRA's react-app preset: ESLint 10 core tracks JSX references, so
// eslint-plugin-react (no ESLint 10 support yet) isn't needed for unused-vars.
export default [
  // tools/vuln-check/fixtures/ (chore/claude-workflow) holds deliberately unsafe code for the scanner's tests
  { ignores: ['build/', 'coverage/', 'infra/', 'tools/**/fixtures/'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } }
    },
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      // CRA's options; React is still imported in most components from the old JSX transform
      'no-unused-vars': ['warn', { args: 'none', ignoreRestSiblings: true, varsIgnorePattern: '^React$' }],
      // New in ESLint 10's recommended set, not in CRA's. Off for parity; revisit in CP3
      'no-useless-assignment': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // Data exported next to a component on purpose (tests and the guide TOC read them)
      'react-refresh/only-export-components': ['warn', {
        allowConstantExport: true,
        allowExportNames: ['prompts', 'canMorph', 'interviewTocEntry']
      }]
    }
  },
  {
    files: ['**/*.test.{js,jsx}', 'src/setupTests.js'],
    languageOptions: { globals: { ...globals.browser, ...globals.vitest } }
  },
  {
    files: ['*.config.mjs'],
    languageOptions: { globals: globals.node }
  },
  {
    // Node CommonJS scripts (package.json has no "type": "module" so require() keeps working)
    files: ['tools/**/*.js'],
    languageOptions: { sourceType: 'commonjs', globals: globals.node }
  }
]
