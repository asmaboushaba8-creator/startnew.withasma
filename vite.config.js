import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: 'src', // هذا السطر السحري سيجعل السيرفر يقرأ الملفات من المجلد الصحيح
})
