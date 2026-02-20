import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				'egg-cream': '#FFF8E7',
				'egg-shell': '#F5E6D3',
				'egg-yolk': '#FFD700',
				'warm-orange': '#FF8C42',
				'sunset-orange': '#FF6B35',
				'cosmic-purple': '#6B5B95',
				'cosmic-blue': '#4A90E2',
				'biotech-green': '#88D498'
			},
			animation: {
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'bounce-subtle': 'bounce-subtle 0.6s ease-in-out',
				'float': 'float 3s ease-in-out infinite'
			},
			keyframes: {
				'pulse-glow': {
					'0%, 100%': { boxShadow: '0 0 5px rgba(255, 215, 0, 0.5)' },
					'50%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.8)' }
				},
				'bounce-subtle': {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.05)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				}
			}
		}
	},
	plugins: []
} satisfies Config;
