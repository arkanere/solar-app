/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      // Colors are defined in @theme block in app.css for Tailwind v4
      // Typography (Inter font stack)
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'sans-serif'
        ],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace']
      },
      // Font sizes with proper line heights
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }]
      },
      // Shadows (Linear uses very subtle, diffused shadows)
      boxShadow: {
        xs: '0 1px 2px rgba(0, 0, 0, 0.04)',
        sm: '0 2px 4px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        DEFAULT:
          '0 4px 8px rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.02)',
        md: '0 6px 12px rgba(0, 0, 0, 0.05), 0 3px 6px rgba(0, 0, 0, 0.03)',
        lg: '0 8px 16px rgba(0, 0, 0, 0.06), 0 4px 8px rgba(0, 0, 0, 0.03)',
        xl: '0 12px 24px rgba(0, 0, 0, 0.08), 0 6px 12px rgba(0, 0, 0, 0.04)',
        card: '0 1px 3px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.1)',
        none: 'none'
      },
      // Border radius (Linear uses subtle rounding)
      borderRadius: {
        none: '0',
        sm: 'calc(var(--radius) - 4px)',
        DEFAULT: 'var(--radius)',
        md: 'calc(var(--radius) + 2px)',
        lg: 'calc(var(--radius) + 4px)',
        xl: 'calc(var(--radius) + 8px)',
        '2xl': 'calc(var(--radius) + 12px)',
        full: '9999px'
      },
      // Animation timing (smooth, not bouncy)
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
        linear: 'linear',
        in: 'cubic-bezier(0.4, 0, 1, 1)',
        out: 'cubic-bezier(0, 0, 0.2, 1)',
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)'
      },
      // Animation durations
      transitionDuration: {
        fast: '100ms',
        DEFAULT: '150ms',
        slow: '200ms',
        slower: '300ms'
      },
      // Keyframe animations
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' }
        },
        'fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' }
        },
        'slide-in-from-top': {
          from: { transform: 'translateY(-10px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' }
        },
        'slide-in-from-bottom': {
          from: { transform: 'translateY(10px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.15s ease-out',
        'fade-out': 'fade-out 0.15s ease-out',
        'slide-in-from-top': 'slide-in-from-top 0.2s ease-out',
        'slide-in-from-bottom': 'slide-in-from-bottom 0.2s ease-out'
      },
      // Z-Index scale for consistent layering
      zIndex: {
        base: 'var(--z-base)',
        dropdown: 'var(--z-dropdown)',
        sticky: 'var(--z-sticky)',
        fixed: 'var(--z-fixed)',
        'modal-backdrop': 'var(--z-modal-backdrop)',
        modal: 'var(--z-modal)',
        popover: 'var(--z-popover)',
        tooltip: 'var(--z-tooltip)',
        toast: 'var(--z-toast)'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};
