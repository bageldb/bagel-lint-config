#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Files to auto-copy on install
const filesToCopy = [
  {
    src: path.join(__dirname, '../prettier/.prettierignore'),
    dest: path.join(process.cwd(), '.prettierignore'),
  },
  {
    src: path.join(__dirname, '../editorconfig/.editorconfig'),
    dest: path.join(process.cwd(), '.editorconfig'),
  },
  {
    src: path.join(__dirname, '../tsconfig/tsconfig.json'),
    dest: path.join(process.cwd(), 'tsconfig.json'),
  },
  {
    src: path.join(__dirname, '../tsconfig/tsconfig.app.json'),
    dest: path.join(process.cwd(), 'tsconfig.app.json'),
  },
  {
    src: path.join(__dirname, '../tsconfig/tsconfig.node.json'),
    dest: path.join(process.cwd(), 'tsconfig.node.json'),
  },
  {
    src: path.join(__dirname, '../vscode/settings.json'),
    dest: path.join(process.cwd(), '.vscode/settings.json'),
  },
  {
    src: path.join(__dirname, '../vscode/extensions.json'),
    dest: path.join(process.cwd(), '.vscode/extensions.json'),
  },
]

console.log('📦 Setting up @bagelink/lint-config...')

filesToCopy.forEach(({ src, dest }) => {
  try {
    // Create parent directory if it doesn't exist
    const destDir = path.dirname(dest)
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true })
    }

    // Only copy if destination doesn't exist
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(src, dest)
      console.log(`✅ Copied ${path.basename(dest)}`)
    } else {
      console.log(`⏭️  Skipped ${path.basename(dest)} (already exists)`)
    }
  } catch (error) {
    console.warn(`⚠️  Failed to copy ${path.basename(dest)}:`, error.message)
  }
})

console.log('✨ Setup complete!')

