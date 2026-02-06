import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5A3BFF',
        secondary: '#1FD6FF',
        accent: '#FF7AC6',
        background: '#0A0A12',
        surface: '#151521',
        'text-primary': '#F1F3F8',
        'text-secondary': '#A3A9B8',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #5A3BFF 0%, #1FD6FF 100%)',
        'gradient-accent': 'linear-gradient(135deg, #FF7AC6 0%, #5A3BFF 100%)',
      },
    },
  },
  plugins: [],
}
export default config
