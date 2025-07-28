import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ Tailwind works via PostCSS, no plugin needed

export default defineConfig({
  plugins: [react()],
})
