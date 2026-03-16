import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    // leaflet MUST be included so Vite converts CJS→ESM (needed for react-leaflet named imports)
    include: [
      'react', 'react-dom', 'react-dom/client',
      'react-is', 'recharts',
      'leaflet', 'react-leaflet',
      '@react-three/fiber', '@react-three/drei',
    ],
  },
})
