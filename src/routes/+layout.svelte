<script lang="ts">
	//src/routes/+layout.svelte
	import { page } from "$app/stores"
	import { WebsiteName } from "./../config"
	import "./../app.css"
	import Icon from '@iconify/svelte';
  
	// Define navItems if not provided by siteConfig
	const navItems = [
	  // { href: "/blog", label: "Blog" },
	  { href: "/pricing", label: "Pricing" },
	  { href: "/contact_us", label: "Contact Us" },
	  // { href: "/search", label: "Search" },
	  {
		href: "/account",
		label: "Dashboard",
		className: "border border-primary rounded-full ml-4",
	  },
	]
</script>

<div data-theme="snappitheme" class="min-h-screen bg-base-100">
  <div class="fixed top-0 left-0 right-0 z-50 flex justify-center w-full px-4 py-3">
	<nav class="navbar bg-base-100 backdrop-blur-lg shadow-lg w-full rounded-full px-6 max-w-5xl transition-all duration-200 hover:shadow-xl">
	  <div class="flex-1">
		<a href="/" class="btn btn-ghost normal-case font-bold text-xl gap-2 rounded-full hover:bg-base-200 transition-colors duration-200">
		  <img src="/favicon.png" alt="Logo" class="w-8 h-8" />
		  {WebsiteName}
		</a>
	  </div>

	  <div class="flex-none">
		<!-- Desktop Menu -->
		<ul class="menu menu-horizontal px-1 hidden sm:flex items-center space-x-2 font-bold text-lg">
		  {#each navItems as item}
			<li class="md:mx-2">
			  <a href={item.href} class="btn btn-ghost rounded-full font-medium transition-all duration-200 hover:bg-base-200 {item.className || ''}" class:active={$page?.url?.pathname === item.href}>
				{item.label}
			  </a>
			</li>
		  {/each}
		  <!-- <li class="ml-2">
			<ModeToggle />
		  </li> -->
		</ul>

		<!-- Mobile Menu -->
		<div class="dropdown dropdown-end sm:hidden">
		  <div class="flex items-center gap-2">
			<!-- <ModeToggle /> -->
			<!-- Using button instead of label, and adding tabindex for dropdown trigger -->
			<button tabindex="0" class="btn btn-ghost btn-circle">
			  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
			  </svg>
			</button>
		  </div>
		  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		  <ul tabindex="0" class="menu menu-lg dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-100 rounded-box w-52 font-bold">
			{#each navItems as item}
			  <li>
				<a href={item.href} class="hover:bg-base-200 transition-colors duration-200 rounded-full my-1" class:active={$page?.url?.pathname === item.href}>
				  {item.label}
				</a>
			  </li>
			{/each}
		  </ul>
		</div>
	  </div>
	</nav>
  </div>

  <!-- Spacer for fixed navbar -->
  <div class="h-24"></div>

  <div>
	<slot />
  </div>

  <!-- Spacer grows so the footer can be at bottom on short pages -->
  <div class="flex-grow"></div>

  <div class="border-t w-full mt-20">
	<footer class="px-6 py-8 md:py-12 max-w-6xl mx-auto">
	  <div class="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
		<!-- Brand Section - full width on small mobile, half on larger mobile -->
		<div class="col-span-2 md:col-span-1 my-5 md:my-0">
		  <a href="/" class="flex flex-col space-y-4">
			<img src="/favicon.png" alt="Logo" class="w-20 h-20" />
			<span class="text-2xl font-bold">{WebsiteName}</span>
			<p class="text-lg text-base-content/70">Look Sharp. Stand Out.</p>
		  </a>
		</div>

		<!-- Navigation Sections - each takes half the width on mobile -->
		<div class="space-y-3">
		  <h3 class="font-semibold">Product</h3>
		  <ul class="space-y-2">
			<li>
			  <a href="/pricing" class="text-sm hover:underline">Pricing</a>
			</li>
			<li><a href="/" class="text-sm hover:underline">Blog</a></li>
			<li><a href="/" class="text-sm hover:underline">Search</a></li>
		  </ul>
		</div>

		<div class="space-y-3">
		  <h3 class="font-semibold">Company</h3>
		  <ul class="space-y-2">
			<li><a href="/" class="text-sm hover:underline">About</a></li>
			<li>
			  <a href="/contact_us" class="text-sm hover:underline">Contact</a>
			</li>
			<li>
			  <a href="/" class="text-sm hover:underline">Careers</a>
			</li>
		  </ul>
		</div>

		<div class="space-y-3">
		  <h3 class="font-semibold">Legal</h3>
		  <ul class="space-y-2">
			<li>
			  <a href="/" class="text-sm hover:underline">Privacy Policy</a>
			</li>
			<li>
			  <a href="/" class="text-sm hover:underline">Terms of Service</a>
			</li>
			<li>
			  <a href="/" class="text-sm hover:underline">Cookie Policy</a>
			</li>
		  </ul>
		</div>
	  </div>

	  <!-- Bottom Section with Socials and Copyright -->
	  <div class="flex flex-col md:flex-row justify-between items-center mt-8 md:mt-12 pt-6 border-t">
		<p class="text-sm text-base-content/70 mb-4 md:mb-0">
		  © {new Date().getFullYear()}
		  {WebsiteName}. All rights reserved.
		</p>

		<div class="flex items-center space-x-4">
		  <a href="https://instagram.com/unibooth_ai" target="_blank" class="p-2 rounded-full hover:bg-base-200 transition-colors duration-200" aria-label="Instagram">
			<!-- Instagram SVG -->
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
			  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
			  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
			</svg>
		  </a>
		  <a href="https://linkedin.com/company/your-company" target="_blank" class="p-2 rounded-full hover:bg-base-200 transition-colors duration-200" aria-label="LinkedIn">
			<!-- LinkedIn SVG -->
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
			  <rect x="2" y="9" width="4" height="12"></rect>
			  <circle cx="4" cy="4" r="2"></circle>
			</svg>
		  </a>
		  <a href="mailto:unibooth.business@gmail.com" target="_blank" class="p-2 rounded-full hover:bg-base-200 transition-colors duration-200" aria-label="Email">
			<Icon icon="mail" class="w-5 h-5" />
		  </a>
		</div>
	  </div>
	</footer>
  </div>
</div>