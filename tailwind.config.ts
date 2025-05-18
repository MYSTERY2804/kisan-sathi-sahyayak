
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Custom agricultural theme colors
				leaf: {
					50: '#f2f9e9',
					100: '#e4f2d2',
					200: '#c9e5a6',
					300: '#add275',
					400: '#92bf4a',
					500: '#75a02e',
					600: '#5f8423',
					700: '#4a681c',
					800: '#3b5318',
					900: '#314515',
					950: '#172509',
				},
				earth: {
					50: '#f9f7f4',
					100: '#f0ebe3',
					200: '#e0d3c3',
					300: '#cdb59d',
					400: '#b7927a',
					500: '#a77c60',
					600: '#9a6852',
					700: '#805647',
					800: '#6a483e',
					900: '#5a3e36',
					950: '#301f1b',
				},
				harvest: {
					50: '#fff9eb',
					100: '#ffefc6',
					200: '#ffde88',
					300: '#ffc347',
					400: '#ffa921',
					500: '#fd8c06',
					600: '#e16802',
					700: '#ba4a06',
					800: '#983a0d',
					900: '#7c320f',
					950: '#481600',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-slow': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' },
				},
				'bounce-slight': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-slow': 'pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'bounce-slight': 'bounce-slight 2s ease-in-out infinite',
			},
			backgroundImage: {
				'gradient-farm': 'linear-gradient(108deg, rgba(242,245,139,0.2) 17.7%, rgba(148,197,20,0.1) 91.2%)',
				'gradient-earth': 'linear-gradient(to right, rgba(193,193,97,0.2) 0%, rgba(193,193,97,0.1) 0%, rgba(212,212,177,0.15) 100%)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
