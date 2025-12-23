#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Parse command line arguments
const args = process.argv.slice(2)
const forceOverwrite = args.includes('--force') || args.includes('-f')
const upgrade = args.includes('--upgrade') || args.includes('--update') || args.includes('-u')

// If upgrade flag is set, update the package first
if (upgrade) {
  console.log('🔄 Updating @bagelink/lint-config from GitHub...\n')
  
  try {
    // Detect package manager
    const hasBun = fs.existsSync('bun.lockb')
    const hasYarn = fs.existsSync('yarn.lock')
    const hasPnpm = fs.existsSync('pnpm-lock.yaml')
    
    let updateCmd
    if (hasBun) {
      updateCmd = 'bun update @bagelink/lint-config'
    } else if (hasYarn) {
      updateCmd = 'yarn upgrade @bagelink/lint-config'
    } else if (hasPnpm) {
      updateCmd = 'pnpm update @bagelink/lint-config'
    } else {
      updateCmd = 'npm update @bagelink/lint-config'
    }
    
    console.log(`   Running: ${updateCmd}\n`)
    execSync(updateCmd, { stdio: 'inherit' })
    console.log('\n✅ Package updated!\n')
  } catch (error) {
    console.error('❌ Failed to update package:', error.message)
    process.exit(1)
  }
}

// Files to copy
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

console.log('📦 Setting up @bagelink/lint-config...\n')

if (upgrade || forceOverwrite) {
  console.log('⚠️  Force mode enabled - will overwrite existing files\n')
}

let copied = 0
let skipped = 0
let overwritten = 0

filesToCopy.forEach(({ src, dest }) => {
  try {
    // Create parent directory if it doesn't exist
    const destDir = path.dirname(dest)
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true })
    }

    const exists = fs.existsSync(dest)

    if (!exists) {
      fs.copyFileSync(src, dest)
      console.log(`✅ Copied ${path.basename(dest)}`)
      copied++
    } else if (forceOverwrite || upgrade) {
      fs.copyFileSync(src, dest)
      console.log(`🔄 Overwrote ${path.basename(dest)}`)
      overwritten++
    } else {
      console.log(`⏭️  Skipped ${path.basename(dest)} (already exists)`)
      skipped++
    }
  } catch (error) {
    console.warn(`⚠️  Failed to copy ${path.basename(dest)}:`, error.message)
  }
})

console.log('\n✨ Setup complete!')
console.log(`   ${copied} copied, ${overwritten} overwritten, ${skipped} skipped\n`)

if (skipped > 0 && !forceOverwrite && !upgrade) {
  console.log('💡 Tip: Use --force to overwrite existing files or --upgrade to update from GitHub')
  console.log('   bunx bagel-lint-setup --force')
  console.log('   bunx bagel-lint-setup --upgrade\n')
}

