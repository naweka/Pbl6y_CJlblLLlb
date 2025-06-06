import plugin from 'tailwindcss/plugin'

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
	theme: {
		extend: {
			keyframes: {
				loadingFish1: {
					'0%': {
						transform: 'rotate(0deg) translateX(55px) rotate(90deg)',
					},
					'100%': {
						transform: 'rotate(360deg) translateX(55px) rotate(90deg)',
					},
				},
				loadingFish2: {
					'0%': {
						transform: 'rotate(180deg) translateX(55px) rotate(90deg)',
					},
					'100%': {
						transform: 'rotate(540deg) translateX(55px) rotate(90deg)',
					},
				},
				'accordion-down': {
					from: {
						height: '0',
					},
					to: {
						height: 'var(--radix-accordion-content-height)',
					},
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)',
					},
					to: {
						height: '0',
					},
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			height: {
				header: '80px',
			},
			maxWidth: {
				layout: '1400px',
			},
			zIndex: {
				sticky: 1030,
				overlay: 1300,
				modal: 1400,
				popover: 1500,
				toast: 1700,
				tooltip: 1800,
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					1: 'hsl(var(--chart-1))',
					2: 'hsl(var(--chart-2))',
					3: 'hsl(var(--chart-3))',
					4: 'hsl(var(--chart-4))',
					5: 'hsl(var(--chart-5))',
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
		},
	},
	plugins: [
		require('tailwindcss-animate'),
		plugin(function ({ matchUtilities, theme }) {
			matchUtilities(
				{
					'auto-fill': (value) => ({
						gridTemplateColumns: `repeat(auto-fill, minmax(min(${value}, 100%), 1fr))`,
					}),
					'auto-fit': (value) => ({
						gridTemplateColumns: `repeat(auto-fit, minmax(min(${value}, 100%), 1fr))`,
					}),
				},
				{
					values: theme('width', {}),
				},
			)
		}),
	],
}
