import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['var(--font-mono)', 'monospace'],
        display: ['var(--font-display)', 'serif'],
      },
      colors: {
        terminal: {
          bg: '#0a0a0f',
          surface: '#111118',
          border: '#1e1e2e',
          text: '#e2e2f0',
          muted: '#6b6b8a',
          accent: '#7c6af7',
          grace: '#f59e0b',
          premium: '#ec4899',
          available: '#10b981',
        },
      },
    },
  },
  plugins: [],
}

export default config
