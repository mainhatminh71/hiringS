/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,js,mjs}",
    "./projects/**/*.{html,ts,js,mjs}",
  ],
  theme: {
    extend: {
      // Design System Colors
      colors: {
        primary: {
          DEFAULT: '#0078d4',
          dark: '#106ebe',
          hover: '#106ebe',
        },
        secondary: {
          DEFAULT: '#6264a7',
          dark: '#4f5199',
        },
        accent: {
          yellow: '#ffb900',
          orange: '#ff8c00',
          red: '#e81123',
          purple: '#6264a7',
          cyan: '#00bcf2',
        },
        text: {
          primary: '#323130',
          secondary: '#605e5c',
          tertiary: '#8a8886',
          disabled: '#c8c6c4',
        },
        bg: {
          white: '#ffffff',
          light: '#faf9f8',
          lighter: '#f3f2f1',
          warm: '#fef5e6',
          dark: '#000000',
          gray: '#1a1a1a',
          'gray-dark': '#2d2d2d',
        },
        border: {
          light: '#edebe9',
          default: '#edebe9',
        },
      },
      // Design System Spacing
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        base: '16px',
        lg: '20px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '40px',
        '4xl': '60px',
        '5xl': '80px',
        '6xl': '100px',
      },
      // Design System Typography
      fontFamily: {
        sans: ['Segoe UI', '-apple-system', 'BlinkMacSystemFont', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      fontSize: {
        xs: '10px',
        sm: '14px',
        base: '16px',
        md: '18px',
        lg: '24px',
        xl: '32px',
        '2xl': '36px',
        '3xl': '42px',
        '4xl': '48px',
        '5xl': '56px',
        '6xl': '68px',
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      lineHeight: {
        tight: '1.1',
        normal: '1.2',
        relaxed: '1.5',
        loose: '1.7',
      },
      // Design System Border Radius
      borderRadius: {
        sm: '2px',
        base: '4px',
        lg: '8px',
        full: '50%',
      },
      // Design System Shadows
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        base: '0 2px 8px rgba(0, 0, 0, 0.1)',
        md: '0 4px 12px rgba(0, 120, 212, 0.1)',
        lg: '0 8px 24px rgba(0, 0, 0, 0.1)',
        xl: '0 12px 32px rgba(0, 0, 0, 0.15)',
      },
      // Design System Transitions
      transitionDuration: {
        fast: '0.2s',
        base: '0.3s',
        slow: '0.5s',
      },
      // Design System Breakpoints
      screens: {
        xs: '480px',
        sm: '768px',
        md: '992px',
        lg: '1200px',
        xl: '1400px',
        '2xl': '1600px',
      },
      // Design System Container
      maxWidth: {
        'container-sm': '1400px',
        'container-lg': '1600px',
      },
      // Design System Z-Index
      zIndex: {
        base: '1',
        sticky: '100',
        dropdown: '200',
        modal: '300',
        tooltip: '400',
      },
      // Design System Opacity
      opacity: {
        disabled: '0.7',
        hover: '0.8',
      },
    },
  },
  plugins: [],
}
