import { defineConfig } from 'vite'
import type { ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Middleware: POST /api/save-config → saves config + image to project root
function saveConfigPlugin() {
  return {
    name: 'engelism-save-config',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api/save-config', (req, res) => {
        if (req.method !== 'POST') { res.statusCode = 405; res.end(); return }

        let body = ''
        req.on('data', (chunk: string) => { body += chunk })
        req.on('end', () => {
          try {
            const { config, imageBase64, imageMimeType } = JSON.parse(body)

            // Save config JSON
            writeFileSync(resolve('engelism-config.json'), JSON.stringify(config, null, 2))

            // Save image file
            const ext = imageMimeType?.includes('png') ? '.png' : imageMimeType?.includes('webp') ? '.webp' : '.jpg'
            writeFileSync(resolve(`engelism-reference${ext}`), Buffer.from(imageBase64, 'base64'))

            // Store image filename in config
            config.referenceImage = `engelism-reference${ext}`
            writeFileSync(resolve('engelism-config.json'), JSON.stringify(config, null, 2))

            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true }))
          } catch (err) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: String(err) }))
          }
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    saveConfigPlugin(),
  ],
  server: {
    port: 3001,
    proxy: {
      '/api/openai': {
        target: 'https://api.openai.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/openai/, ''),
      },
      '/api/anthropic': {
        target: 'https://api.anthropic.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/anthropic/, ''),
      },
    },
  },
})
