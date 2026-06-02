/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],

  darkMode: 'class',

  theme: {
    extend: {
      colors: {
        // Deep navy base — academic, authoritative
        navy: {
          50:  '#eef2ff',
          100: '#dde6ff',
          200: '#c0cefd',
          300: '#93adfb',
          400: '#6082f7',
          500: '#3a5bf2',
          600: '#2338e6',
          700: '#1b28d0',
          800: '#1c24a9',
          900: '#1c2285',
          950: '#141554',
        },
        // Warm amber accent — energy, intelligence
        amber: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        // Slate neutrals for surfaces
        surface: {
          0:   '#0a0c14',
          50:  '#0f1220',
          100: '#151929',
          200: '#1d2235',
          300: '#252a40',
          400: '#2e364d',
          500: '#3a4260',
          600: '#4a5275',
        },
        // Semantic
        success: '#22c55e',
        warning: '#f59e0b',
        error:   '#ef4444',
        info:    '#38bdf8',
      },

      fontFamily: {
        // Display: geometric slab for headings
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        // Body: clean humanist sans
        body:    ['"DM Sans"', 'sans-serif'],
        // Mono: code blocks
        mono:    ['"JetBrains Mono"', 'monospace'],
      },

      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },

      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      boxShadow: {
        'glow-navy':  '0 0 24px 4px rgba(58, 91, 242, 0.35)',
        'glow-amber': '0 0 24px 4px rgba(251, 191, 36, 0.30)',
        'card':       '0 4px 24px 0 rgba(0, 0, 0, 0.45)',
        'card-hover': '0 8px 40px 0 rgba(0, 0, 0, 0.60)',
        'inset-top':  'inset 0 1px 0 0 rgba(255,255,255,0.06)',
      },

      backgroundImage: {
        'gradient-radial':  'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':   'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-navy':        'radial-gradient(at 20% 20%, #1b28d0 0px, transparent 50%), radial-gradient(at 80% 80%, #141554 0px, transparent 50%)',
        'noise':            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },

      animation: {
        'fade-in':      'fadeIn 0.4s ease forwards',
        'slide-up':     'slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-in-left':'slideInLeft 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        'pulse-slow':   'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'spin-slow':    'spin 8s linear infinite',
        'blink':        'blink 1.1s step-end infinite',
        'shimmer':      'shimmer 2s linear infinite',
        'bounce-subtle':'bounceSubtle 2s ease-in-out infinite',
      },

      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':       { opacity: '0' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-4px)' },
        },
      },

      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },

      screens: {
        'xs': '480px',
      },

      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '68': '17rem',
        '72': '18rem',
        '84': '21rem',
        '88': '22rem',
        '92': '23rem',
        '96': '24rem',
      },

      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },

  plugins: [],
};
