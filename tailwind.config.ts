import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      colors: {
        brand: {
          bg: '#000000',
          surface: '#1A1A1A',
          'surface-light': '#2A2A2A',
          yellow: '#FCEB54',
          cream: '#F5F4E8',
          text: '#FFFFFF',
          muted: '#88888A',
          dark: '#111111',
        },
      },
      borderRadius: {
        '4xl': '32px',
      }
    },
  },
  plugins: [],
}
export default config
