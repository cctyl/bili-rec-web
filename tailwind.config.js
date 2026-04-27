/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{html,js,vue}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D0BCFF',
          container: '#4F378B',
        },
        secondary: {
          DEFAULT: '#CCC2DC',
          container: '#4A4458',
        },
        tertiary: {
          DEFAULT: '#EFB8C8',
          container: '#633B48',
        },
        error: {
          DEFAULT: '#F2B8B5',
          container: '#8C1D18',
        },
        surface: {
          DEFAULT: '#141218',
          variant: '#49454F',
          container: {
            DEFAULT: '#211F26',
            low: '#1D1B20',
            high: '#2B2930',
            highest: '#36343B',
          },
        },
        outline: {
          DEFAULT: '#938F99',
          variant: '#49454F',
        },
        'on-primary': '#381E72',
        'on-primary-container': '#EADDFF',
        'on-secondary': '#332D41',
        'on-secondary-container': '#E8DEF8',
        'on-tertiary': '#492532',
        'on-tertiary-container': '#FFD8E4',
        'on-error': '#601410',
        'on-error-container': '#F9DEDC',
        'on-surface': '#E6E0E9',
        'on-surface-variant': '#CAC4D0',
        'primary-legacy': '#3B82F6',
        'secondary-legacy': '#10B981',
      },
      borderRadius: {
        'none': '0px',
        'xs': '4px',
        'sm': '8px',
        DEFAULT: '12px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '28px',
        '3xl': '32px',
        'full': '9999px',
        'button': '20px'
      },
      boxShadow: {
        'elevation-1': '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.3)',
        'elevation-2': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3)',
        'elevation-3': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3)',
      }
    }
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.elevation-1': {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.3)',
        },
        '.elevation-2': {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3)',
        },
        '.elevation-3': {
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3)',
        },
      })
    }
  ],
}
