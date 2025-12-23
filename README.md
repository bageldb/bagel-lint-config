# @bagelink/lint-config

ESLint and Prettier configuration for Vue 3 + TypeScript projects.

## Philosophy

- **Prettier owns formatting** — no line length, quotes, semicolons, or indentation rules in ESLint
- **ESLint owns correctness** — catch bugs, enforce best practices, no pedantic preferences
- **Zero conflict** — `eslint-config-prettier` disables all formatting rules; saving never produces lint errors from formatting
- **Minimal dependencies** — only what's needed for Vue 3 + TypeScript

## Installation

### From npm (once published)

```bash
# Bun
bun add -d @bagelink/lint-config eslint prettier eslint-plugin-vue eslint-config-prettier globals @typescript-eslint/eslint-plugin @typescript-eslint/parser vue-eslint-parser typescript

# npm
npm install -D @bagelink/lint-config eslint prettier eslint-plugin-vue eslint-config-prettier globals @typescript-eslint/eslint-plugin @typescript-eslint/parser vue-eslint-parser typescript
```

### From GitHub

```bash
# Bun
bun add -d github:bageldb/lint-config eslint prettier eslint-plugin-vue eslint-config-prettier globals @typescript-eslint/eslint-plugin @typescript-eslint/parser vue-eslint-parser typescript

# npm
npm install -D github:bageldb/lint-config eslint prettier eslint-plugin-vue eslint-config-prettier globals @typescript-eslint/eslint-plugin @typescript-eslint/parser vue-eslint-parser typescript
```

## Usage

### ESLint Configuration

Create `eslint.config.js` at your project root:

```js
import bagelConfig from '@bagelink/lint-config/eslint'

export default [
  ...bagelConfig,
  // Your project-specific overrides here
]
```

Or import the Vue 3 preset explicitly:

```js
import { vue3 } from '@bagelink/lint-config/eslint'

export default [
  ...vue3,
]
```

### Prettier Configuration

Create `prettier.config.cjs` at your project root:

```js
module.exports = require('@bagelink/lint-config/prettier')
```

Or extend it:

```js
const bagelPrettier = require('@bagelink/lint-config/prettier')

module.exports = {
  ...bagelPrettier,
  // Your overrides
  printWidth: 120,
}
```

### VS Code Settings

Copy the recommended settings to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.enable": true,
  "eslint.useFlatConfig": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue"
  ]
}
```

Or copy directly from the package:

```bash
cp node_modules/@bagelink/lint-config/vscode/settings.json .vscode/settings.json
```

### Package Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "lint": "eslint . --max-warnings=0",
    "format": "prettier . --write",
    "format:check": "prettier . --check"
  }
}
```

## CI Integration

Example GitHub Actions workflow:

```yaml
- name: Install dependencies
  run: bun install

- name: Check formatting
  run: bun run format:check

- name: Lint
  run: bun run lint
```

## What's Included

### ESLint Rules

- ✅ Vue 3 recommended rules (including `<script setup>`)
- ✅ TypeScript recommended rules
- ✅ `prefer-const`, `no-debugger`, `no-console` (warn)
- ✅ Unused variables error (except `_` prefixed)
- ✅ Consistent type imports
- ❌ No formatting rules (handled by Prettier)
- ❌ No pedantic preferences

### Prettier Settings

- `printWidth: 100`
- `singleQuote: true`
- `semi: false`
- `trailingComma: 'all'`
- `arrowParens: 'always'`

## License

MIT

