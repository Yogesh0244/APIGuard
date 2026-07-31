/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0B0A14',
          panel: '#16131F',
          raised: '#1E1A2C',
          border: '#2E2843',
        },
        signal: {
          DEFAULT: '#A855F7',
          soft: '#9333EA',
          glow: 'rgba(168, 85, 247, 0.4)',
        },
        flux: {
          DEFAULT: '#FBBF24',
          soft: '#F59E0B',
          glow: 'rgba(251, 191, 36, 0.4)',
        },
        alert: {
          DEFAULT: '#FB923C',
          soft: '#EA7C2C',
        },
        danger: {
          DEFAULT: '#F43F5E',
          soft: '#D62E4C',
        },
        text: {
          primary: '#F5F3FF',
          muted: '#9B93B0',
          faint: '#635C78',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'signal-flux': 'linear-gradient(135deg, #A855F7 0%, #FBBF24 100%)',
        'signal-flux-soft': 'linear-gradient(135deg, rgba(168,85,247,0.16) 0%, rgba(251,191,36,0.16) 100%)',
        'mesh-hero':
          'radial-gradient(circle at 15% 20%, rgba(168,85,247,0.35), transparent 40%), radial-gradient(circle at 85% 15%, rgba(251,191,36,0.22), transparent 45%), radial-gradient(circle at 50% 100%, rgba(168,85,247,0.18), transparent 50%)',
        'radial-glow': 'radial-gradient(circle, var(--tw-gradient-stops))',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(168, 85, 247, 0.35), 0 0 28px rgba(168, 85, 247, 0.28)',
        'glow-flux': '0 0 0 1px rgba(251, 191, 36, 0.35), 0 0 28px rgba(251, 191, 36, 0.25)',
        'glow-lg': '0 0 0 1px rgba(168, 85, 247, 0.3), 0 0 60px rgba(168, 85, 247, 0.25), 0 0 100px rgba(251, 191, 36, 0.12)',
        panel: '0 1px 0 rgba(255,255,255,0.03) inset, 0 12px 32px rgba(0,0,0,0.45)',
        'panel-hover': '0 1px 0 rgba(255,255,255,0.05) inset, 0 24px 56px rgba(0,0,0,0.55), 0 0 0 1px rgba(168,85,247,0.2)',
      },
      keyframes: {
        pulseTick: {
          '0%': { transform: 'scaleY(0.3)', opacity: '0.4' },
          '50%': { transform: 'scaleY(1)', opacity: '1' },
          '100%': { transform: 'scaleY(0.3)', opacity: '0.4' },
        },
        scan: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '200% 0%' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '33%': { transform: 'translateY(-18px) translateX(12px)' },
          '66%': { transform: 'translateY(10px) translateX(-14px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.15)' },
        },
        meshMove: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
          '50%': { transform: 'scale(1.08) rotate(4deg)' },
        },
      },
      animation: {
        pulseTick: 'pulseTick 1.6s ease-in-out infinite',
        scan: 'scan 3s linear infinite',
        fadeInUp: 'fadeInUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) both',
        float: 'float 13s ease-in-out infinite',
        floatSlow: 'float 19s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        glowPulse: 'glowPulse 2.4s ease-in-out infinite',
        meshMove: 'meshMove 14s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
