import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   base: '/egg-domoro',
// })

export default defineConfig({
  plugins: [react()],
  base: '/egg-domoro/',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        notFound: 'index.html', // fallback buat GitHub Pages
      },
    },
  },
})
