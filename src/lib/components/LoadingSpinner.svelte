<!-- src/lib/components/LoadingSpinner.svelte -->
<script lang="ts">
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let text: string = 'Loading...';
  export let centered: boolean = true;
  
  const sizeClasses = {
    sm: 'loading-sm',
    md: 'loading-md', 
    lg: 'loading-lg'
  };
</script>

<div class="flex flex-col items-center gap-4" class:justify-center={centered} class:py-16={centered}>
  <div class="loading loading-spinner {sizeClasses[size]} text-primary"></div>
  {#if text}
    <p class="text-base-content/70">{text}</p>
  {/if}
</div>