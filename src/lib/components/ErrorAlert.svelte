<!-- src/lib/components/ErrorAlert.svelte -->
<script lang="ts">
  import Icon from '@iconify/svelte';
  
  export let error: string;
  export let title: string = 'Error';
  export let dismissible: boolean = false;
  export let onDismiss: (() => void) | undefined = undefined;
</script>

<div class="alert alert-error">
  <Icon icon="lucide:alert-circle" class="h-5 w-5" />
  <div class="flex-1">
    <h3 class="font-semibold">{title}</h3>
    <div class="text-sm">{error}</div>
  </div>
  {#if dismissible && onDismiss}
    <button class="btn btn-sm btn-ghost" on:click={onDismiss}>
      <Icon icon="lucide:x" class="h-4 w-4" />
    </button>
  {/if}
</div>