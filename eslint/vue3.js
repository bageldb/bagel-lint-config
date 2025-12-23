import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import vueParser from 'vue-eslint-parser'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  // Base recommended rules
  js.configs.recommended,
  
  // Vue 3 recommended rules
  ...pluginVue.configs['flat/recommended'],
  
  // Disable formatting rules
  eslintConfigPrettier,
  
  // File matching and parser configuration
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        parser: tsparser,
        extraFileExtensions: ['.vue'],
      },
    },
  },
  
  // TypeScript-specific configuration
  {
    files: ['**/*.{ts,tsx,vue}'],
    plugins: {
      '@typescript-eslint': tseslint,
    },
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsparser,
        project: null, // Disable type-aware linting by default for speed
        extraFileExtensions: ['.vue'],
      },
    },
    rules: {
      // TypeScript recommended rules (manually applied)
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-unused-expressions': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixable: 'code' },
      ],
      
      // Disable base rule as it conflicts with TS version
      'no-unused-vars': 'off',
      'no-unused-expressions': 'off',
    },
  },
  
  // General quality rules
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx,vue}'],
    rules: {
      // Correctness and quality
      'prefer-const': 'error',
      'no-debugger': 'error',
      'no-console': 'warn',
      'no-var': 'error',
      'no-undef': 'error',
      'eqeqeq': ['error', 'always', { null: 'ignore' }],
      'no-constant-condition': 'error',
      'no-duplicate-imports': 'error',
      
      // Vue 3 + <script setup> specific overrides
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',
      'vue/no-v-html': 'warn',
      
      // Disable pedantic template formatting rules
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-self-closing': 'off',
      'vue/html-indent': 'off',
    },
  },
  
  // Ignore patterns
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.nuxt/**',
      '**/.output/**',
      '**/coverage/**',
      '**/.vscode/**',
      '**/.idea/**',
    ],
  },
]

