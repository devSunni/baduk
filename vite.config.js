import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/baduk/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest}'],
        cleanupOutdatedCaches: true,
        navigateFallback: '/baduk/index.html',
        clientsClaim: true,
        skipWaiting: true
      },
      devOptions: { enabled: true },
      manifest: {
        name: '바둑 정석 학습',
        short_name: '바둑정석',
        start_url: '/baduk/',
        scope: '/baduk/',
        display: 'standalone',
        background_color: '#2c3e50',
        theme_color: '#2c3e50',
        description: '바둑 정석을 배우는 모바일 게임',
        icons: [
          { src: 'baduk-icon.svg', sizes: 'any', type: 'image/svg+xml' }
        ]
      }
    })
  ],
  server: {
    port: 3000,
    open: true
  },
  build: {
    target: 'es2015',
    outDir: 'dist'
  }
}) 