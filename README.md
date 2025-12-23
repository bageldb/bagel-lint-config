# @bagelink/lint-config

ESLint and Prettier configuration for Vue 3 + TypeScript projects.

## Philosophy

- **Prettier owns formatting** — no line length, quotes, semicolons, or indentation rules in ESLint
- **ESLint owns correctness** — catch bugs, enforce best practices, no pedantic preferences
- **Zero conflict** — `eslint-config-prettier` disables all formatting rules; saving never produces lint errors from formatting
- **Minimal dependencies** — only what's needed for Vue 3 + TypeScript
- **Near-zero consumer config** — centralized configs, auto-setup script, one-line usage

## Quick Start

```bash
# Install all dependencies
bun add -d @bagelink/lint-config eslint prettier eslint-plugin-vue eslint-config-prettier globals @typescript-eslint/eslint-plugin @typescript-eslint/parser vue-eslint-parser typescript simple-git-hooks lint-staged vue-tsc

# Auto-setup (copies config files)
bunx bagel-lint-setup

# Create eslint.config.js
echo "export { default } from '@bagelink/lint-config/eslint'" > eslint.config.js

# Setup git hooks
bun run prepare
```

See [Full Setup Guide](#full-setup-guide) below for complete instructions.

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

## Full Setup Guide

### 1. Install Dependencies

```bash
bun add -d @bagelink/lint-config eslint prettier eslint-plugin-vue eslint-config-prettier globals @typescript-eslint/eslint-plugin @typescript-eslint/parser vue-eslint-parser typescript simple-git-hooks lint-staged vue-tsc
```

### 2. Run Auto-Setup

```bash
bunx bagel-lint-setup
```

This copies the following to your project:
- `.prettierignore`
- `.editorconfig`
- `tsconfig.json`
- `tsconfig.app.json`
- `tsconfig.node.json`
- `.vscode/settings.json` — Format on save, ESLint integration
- `.vscode/extensions.json` — Recommended VS Code extensions

### 3. Create ESLint Config

**Option A: Minimal (Recommended)**

Create `eslint.config.js`:

```js
export { default } from '@bagelink/lint-config/eslint'
```

**Option B: With Overrides**

```js
import bagelConfig from '@bagelink/lint-config/eslint'

export default [
  ...bagelConfig,
  // Your project-specific overrides
  {
    rules: {
      'no-console': 'off',
    },
  },
]
```

### 4. Update package.json

Add these configurations:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "prepare": "simple-git-hooks"
  },
  "prettier": "@bagelink/lint-config/prettier",
  "simple-git-hooks": {
    "pre-commit": "bunx --bun lint-staged"
  },
  "lint-staged": {
    "*.{js,mjs,cjs,ts,mts,cts,vue}": ["eslint --fix", "prettier --write"],
    "*.{json,md,html,css,scss}": ["prettier --write"]
  }
}
```

### 5. Initialize Git Hooks

```bash
bun run prepare
```

### 6. Install VS Code Extensions

When you open the project in VS Code, you'll be prompted to install recommended extensions:
- Prettier
- ESLint
- Vue Language Features (Volar)

Click "Install All" when prompted, or install manually:

```bash
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
code --install-extension vue.volar
code --install-extension vue.vscode-typescript-vue-plugin
```

After installing extensions, **reload VS Code** for format-on-save to activate.

## Advanced Usage

### Custom Prettier Config

If you need to override Prettier settings, create `prettier.config.cjs`:

```js
const bagelPrettier = require('@bagelink/lint-config/prettier')

module.exports = {
  ...bagelPrettier,
  printWidth: 120, // Override
}
```

### Custom ESLint Rules

See Option B in [Step 3](#3-create-eslint-config) above.

## CI Integration

### GitHub Actions

```yaml
name: Lint & Format

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1

      - name: Install dependencies
        run: bun install

      - name: Check formatting
        run: bun run format:check

      - name: Lint
        run: bun run lint
```

### Pre-commit Hook

Automatically runs on every commit (configured via `simple-git-hooks`):

- ESLint auto-fix on JS/TS/Vue files
- Prettier format on all supported files
- Only stages changed files via `lint-staged`

## What's Included

### ESLint Rules

- ✅ Vue 3 recommended rules (including `<script setup>`)
- ✅ TypeScript recommended rules
- ✅ Browser, Node, and ES2021 globals
- ✅ `prefer-const`, `no-debugger`
- ✅ Unused variables error (except `_` prefixed)
- ✅ Consistent type imports (allows splitting type and regular imports)
- ✅ `console` and `any` are allowed
- ❌ No formatting rules (handled by Prettier)
- ❌ No pedantic preferences

### Prettier Settings

- `printWidth: 100`
- `singleQuote: true`
- `semi: false`
- `trailingComma: 'all'`
- `arrowParens: 'always'`
- `endOfLine: 'lf'`

### Additional Files

- `.prettierignore` — Ignore build outputs, dependencies, IDE files
- `.editorconfig` — Consistent editor settings (2 spaces, LF, UTF-8)
- `tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json` — TypeScript configuration for Vue 3 + Vite
- `.vscode/settings.json` — Format on save, ESLint auto-fix
- `.vscode/extensions.json` — Recommended VS Code extensions
- Git hooks config — Auto-format and lint on commit

### TypeScript Configuration

The included TypeScript configs are optimized for Vue 3 + Vite projects:

**Key Features:**
- ✅ `types: []` in app config — prevents @types conflicts with ESLint
- ✅ `lib: ["ES2022"]` — modern JS features (Object.hasOwn, String.replaceAll)
- ✅ `exclude: ["**/.*"]` — excludes hidden config files from type checking
- ✅ Project references — separate configs for app code vs build tooling
- ✅ Strict mode enabled with unused variable checks
- ✅ Path aliases (`@/*` → `./src/*`)

## Migration Guide

### From Previous Versions

```bash
# 1. Update package
bun update @bagelink/lint-config

# 2. Run setup script
bunx bagel-lint-setup

# 3. Simplify eslint.config.js to one line
echo "export { default } from '@bagelink/lint-config/eslint'" > eslint.config.js

# 4. Remove old config files (if upgrading)
rm -f prettier.config.cjs .eslintrc.* .prettierrc.*

# 5. Review auto-copied TypeScript configs (customize if needed)
# tsconfig.json, tsconfig.app.json, tsconfig.node.json

# 6. Update package.json (see Full Setup Guide)

# 7. Test
bun run lint
bun run format
```

## Troubleshooting

### Git Hooks Not Running

```bash
# Reinitialize hooks
bun run prepare
```

### ESLint Not Finding Config

Ensure `eslint.config.js` is at your project root and uses ES module syntax.

### Format on Save Not Working

1. **Install required VS Code extensions** (see `.vscode/extensions.json`)
2. **Reload VS Code** after installing
3. Check `.vscode/settings.json` exists with `"editor.formatOnSave": true`
4. Verify Prettier is set as default formatter:
   - Right-click in a file → "Format Document With..." → "Configure Default Formatter"
   - Select "Prettier - Code formatter"

### Prettier Ignoring Files

Check `.prettierignore` is in your project root. Run `bunx bagel-lint-setup` to regenerate.

### TypeScript Errors

If you get TypeScript errors about conflicting types:
- Check that `tsconfig.app.json` has `"types": []` (prevents auto-including @types)
- Ensure `exclude: ["**/.*"]` is present to exclude config files
- Run `bunx bagel-lint-setup` to regenerate configs from the latest version

## Package Exports

The following can be imported in your project:

- `@bagelink/lint-config/eslint` — ESLint flat config
- `@bagelink/lint-config/prettier` — Prettier config
- `@bagelink/lint-config/lint-staged` — lint-staged config
- `@bagelink/lint-config/git-hooks` — simple-git-hooks config
- `@bagelink/lint-config/vscode/settings` — VS Code settings
- `@bagelink/lint-config/vscode/extensions` — VS Code extensions
- `@bagelink/lint-config/prettierignore` — Prettier ignore patterns
- `@bagelink/lint-config/editorconfig` — EditorConfig settings
- `@bagelink/lint-config/tsconfig` — Root TypeScript config
- `@bagelink/lint-config/tsconfig/app` — App TypeScript config
- `@bagelink/lint-config/tsconfig/node` — Node/Vite TypeScript config

## License

MIT

