import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split Firebase into its own chunk (~330KB gzipped → separate load)
          'firebase-app':      ['firebase/app'],
          'firebase-auth':     ['firebase/auth'],
          'firebase-firestore':['firebase/firestore'],
          // Split React ecosystem
          'vendor-react':      ['react', 'react-dom', 'react-router'],
          // Split heavy UI libs
          'vendor-leaflet':    ['leaflet', 'react-leaflet'],
          'vendor-recharts':   ['recharts'],
          'vendor-mui':        ['@mui/material', '@mui/icons-material'],
        },
      },
    },
  },
})
