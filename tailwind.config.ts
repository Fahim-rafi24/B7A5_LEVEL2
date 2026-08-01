import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#2563EB',
                    light: '#3B82F6',
                    dark: '#1D4ED8',
                },
                secondary: '#0F172A',
                surface: '#FFFFFF',
                'surface-alt': '#F8FAFC',
                border: '#E2E8F0',
                text: {
                    DEFAULT: '#0F172A',
                    secondary: '#475569',
                    muted: '#94A3B8',
                },
                success: '#10B981',
                warning: '#F59E0B',
                danger: '#EF4444',
            },
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
            },
            borderRadius: {
                DEFAULT: '12px',
                lg: '16px',
                xl: '24px',
            },
            boxShadow: {
                sm: '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
                md: '0 4px 24px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04)',
                lg: '0 12px 48px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04)',
                xl: '0 24px 64px rgba(0, 0, 0, 0.10), 0 8px 24px rgba(0, 0, 0, 0.06)',
            },
            keyframes: {
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                slideIn: {
                    '0%': { opacity: '0', transform: 'translateX(40px) scale(0.96)' },
                    '100%': { opacity: '1', transform: 'translateX(0) scale(1)' },
                },
                modalIn: {
                    '0%': { opacity: '0', transform: 'scale(0.94) translateY(20px)' },
                    '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
                },
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(16px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
            animation: {
                shimmer: 'shimmer 1.6s ease-in-out infinite',
                'slide-in': 'slideIn 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
                'modal-in': 'modalIn 0.30s cubic-bezier(0.22, 1, 0.36, 1)',
                'fade-up': 'fadeUp 0.35s ease',
            },
        },
    },
    plugins: [],
};

export default config;
