<script>
	import "../app.css";
	import Icon from '@iconify/svelte';
	// import { Image, Github } from 'lucide-svelte';
</script>

<div class="min-h-screen flex flex-col">
	<header class="border-b bg-base-100">
		<div class="container mx-auto py-4 px-4 flex justify-between items-center">
			<a href="/" class="flex items-center gap-2">
				<Icon icon="lucide:image" class="h-6 w-6" />
				<!-- <Image class="h-6 w-6" /> -->
				<span class="font-bold text-xl">ImageShare</span>
			</a>
			
			<nav>
				<ul class="flex items-center gap-4">
					<li>
						<a href="/folder/create" class="link link-hover">
							Create Folder
						</a>
					</li>
					<li>
						<a 
							href="https://github.com/your-username/sveltekit-image-uploader" 
							target="_blank" 
							rel="noopener noreferrer"
							class="flex items-center gap-1 link link-hover"
						>
							<Icon icon="lucide:github" class="h-4 w-4" />
							<!-- <Github class="h-4 w-4" /> -->
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
	
	<footer class="border-t py-6 bg-base-100">
		<div class="container mx-auto px-4">
			<div class="flex flex-col md:flex-row justify-between items-center gap-4">
				<div class="flex items-center gap-2">
					<Icon icon="lucide:image" class="h-5 w-5" />
					<!-- <Image class="h-5 w-5" /> -->
					<span class="font-semibold">ImageShare</span>
				</div>
				
				<p class="text-sm text-base-content/70">
					Built with SvelteKit, Supabase, and Google Cloud Storage
				</p>
			</div>
		</div>
	</footer>
</div>