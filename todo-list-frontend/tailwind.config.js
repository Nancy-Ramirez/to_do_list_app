/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Escanea todos los archivos JS/JSX/TS/TSX en src/
  ],
  theme: {
    extend: {}, // personalizar el tema aquí (colores, fuentes, etc.)
  },
  plugins: [], // plugins de Tailwind aquí
}