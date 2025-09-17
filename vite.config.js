import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { copyFileSync, mkdirSync } from 'fs'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    viteSingleFile(),
    // ビルド後にlib/をdist/にコピー
    {
      name: 'copy-lib',
      writeBundle() {
        try {
          mkdirSync('dist/lib', { recursive: true })
          copyFileSync('lib/crypto-js.min.js', 'dist/lib/crypto-js.min.js')
          console.log('✓ Copied lib/crypto-js.min.js to dist/lib/')
        } catch (error) {
          console.warn('⚠ Failed to copy lib files:', error.message)
        }
      }
    }
  ],
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html',
      output: {
        inlineDynamicImports: true
      }
    },
    modulePreload: false,
    assetsInlineLimit: 0
  }
})
