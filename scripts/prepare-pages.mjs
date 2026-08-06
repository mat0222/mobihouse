import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const distDir = resolve(process.cwd(), 'dist')
const indexPath = resolve(distDir, 'index.html')
const notFoundPath = resolve(distDir, '404.html')

if (!existsSync(indexPath)) {
  console.error('No se encontró dist/index.html. Ejecutá npm run build primero.')
  process.exit(1)
}

// GitHub Pages sirve 404.html en rutas SPA desconocidas.
copyFileSync(indexPath, notFoundPath)
console.log('GitHub Pages: dist/404.html listo para rutas SPA.')
