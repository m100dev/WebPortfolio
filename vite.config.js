import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // REACT_APP_ is kept so Amplify's existing REACT_APP_VISITOR_API_URL needs no console change
  envPrefix: ['VITE_', 'REACT_APP_'],
  build: {
    // Amplify's artifact folder is build/, as it was under Create React App
    outDir: 'build',
    // Memo bodies stay separate .md files (as under CRA) instead of data: URLs inlined into the JS
    assetsInlineLimit: (file) => (/\.md($|\?)/.test(file) ? false : undefined)
  },
  // The counter API's CORS allows localhost:3000
  server: { port: 3000 },
  preview: { port: 3000 },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: 'src/setupTests.js'
  }
})
