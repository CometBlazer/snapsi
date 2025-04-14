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
	plugins: [daisyui]
}