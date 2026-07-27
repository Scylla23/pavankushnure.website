import type { Config } from 'tailwindcss'

// Every value here traces to DESIGN.md. Change the doc first, then this file.
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--color-canvas)',
        surface: 'var(--color-surface)',
        'surface-2': 'var(--color-surface-2)',
        line: 'var(--color-border)',
        cream: 'var(--color-text)',
        muted: 'var(--color-text-muted)',
        dim: 'var(--color-text-dim)',
        ember: 'var(--color-accent)',
        'ember-hover': 'var(--color-accent-hover)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // DESIGN.md §2 type scale
        display: ['clamp(40px, 6vw, 56px)', { lineHeight: '0.95', letterSpacing: '-0.02em', fontWeight: '600' }],
        heading: ['clamp(30px, 4vw, 41px)', { lineHeight: '1.0', letterSpacing: '-0.015em', fontWeight: '600' }],
        subheading: ['24px', { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: '600' }],
        lede: ['20px', { lineHeight: '1.55' }],
        body: ['18px', { lineHeight: '1.6' }],
        small: ['14px', { lineHeight: '1.5' }],
        label: ['13px', { lineHeight: '1.2', letterSpacing: '0.1em', fontWeight: '500' }],
        micro: ['12px', { lineHeight: '1.2', letterSpacing: '0.08em', fontWeight: '500' }],
      },
      spacing: {
        // 8px scale (D7)
        '1': '4px', '2': '8px', '3': '12px', '4': '16px',
        '6': '24px', '8': '32px', '12': '48px', '16': '64px',
        '24': '96px', '32': '128px',
      },
      borderRadius: {
        card: '12px',
        ghost: '24px',
        pill: '9999px',
      },
      maxWidth: {
        container: '1080px',
        measure: '62ch',
      },
    },
  },
  plugins: [],
}

export default config
