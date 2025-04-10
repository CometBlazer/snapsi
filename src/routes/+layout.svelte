<script>
	import "../app.css";
	import { Image, Github } from 'lucide-svelte';
  </script>
  
  <div class="min-h-screen flex flex-col">
	<header class="">
	  <div class="container mx-auto py-4 px-4 flex justify-between items-center">
		<a href="/" class="flex items-center gap-2">
		  <Image class="h-6 w-6" />
		  <span class="font-bold text-xl">ImageShare</span>
		</a>
		
		<nav>
		  <ul class="flex items-center gap-4">
			<li>
			  <a href="/folder/create" class="text-sm font-medium hover:text-primary">
				Create Folder
			  </a>
			</li>
			<li>
			  <a 
				href="https://github.com/your-username/sveltekit-image-uploader" 
				target="_blank" 
				rel="noopener noreferrer"
				class="flex items-center gap-1 text-sm font-medium hover:text-primary"
			  >
				<Github class="h-4 w-4" />
				<span>GitHub</span>
			  </a>
			</li>
		  </ul>
		</nav>
	  </div>
	</header>
	
	<main class="flex-1">
	  <slot />
	</main>
	
	<footer class="border-t py-6">
	  <div class="container mx-auto px-4">
		<div class="flex flex-col md:flex-row justify-between items-center gap-4">
		  <div class="flex items-center gap-2">
			<Image class="h-5 w-5" />
			<span class="font-semibold">ImageShare</span>
		  </div>
		  
		  <p class="text-sm text-muted-foreground">
			Built with SvelteKit, Supabase, and Google Cloud Storage
		  </p>
		</div>
	  </div>
	</footer>
  </div>