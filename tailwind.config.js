/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
	  container: {
		center: true,
		padding: "2rem",
		screens: {
		  "2xl": "1400px",
		},
	  },
	  extend: {},
	},
	plugins: [daisyui],
	daisyui: {
		themes: [
			{
			  snappitheme: {
				primary: "#180042",
				"primary-content": "#fefbf6",
				secondary: "#c7b9f8",
				neutral: "#180042",
				"neutral-content": "#fefbf6",
				accent: "#db2777",
				"accent-content": "#180042",
				"base-content": "#180042",
				"base-100": "#ffffff",
				"base-200": "#faedd6",
				"base-300": "#f5e8c7",
				success: "#37d399",
				error: "#f77272",
				info: "#3abff8",
				warning: "#fbbd23",
			  },
			},
			"light",
		],
		darkTheme: "dark",
		base: true,
		styled: true,
		utils: true,
		prefix: "",
		logs: true,
		themeRoot: ":root",
	},
}