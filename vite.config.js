import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-photos',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.startsWith('/PHOTOS/')) {
            const decodedPath = decodeURIComponent(req.url)
            const filePath = path.join(process.cwd(), decodedPath)
            if (fs.existsSync(filePath)) {
              res.setHeader('Content-Type', 'image/jpeg')
              fs.createReadStream(filePath).pipe(res)
              return
            }
          }
          next()
        })
      },
      // For production build copy PHOTOS into dist/PHOTOS without touching original
      closeBundle() {
        const srcPhotos = path.join(process.cwd(), 'PHOTOS')
        const distPhotos = path.join(process.cwd(), 'dist', 'PHOTOS')
        if (fs.existsSync(srcPhotos)) {
          fs.mkdirSync(distPhotos, { recursive: true })
          const files = fs.readdirSync(srcPhotos)
          for (const file of files) {
            fs.copyFileSync(path.join(srcPhotos, file), path.join(distPhotos, file))
          }
        }
      }
    }
  ],
  server: {
    port: 5173,
    open: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  }
})
