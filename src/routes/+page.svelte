<script lang="ts">
  //src/routes/+page.svelte
  import { goto } from '$app/navigation';
  import Icon from '@iconify/svelte';
  import { onMount } from 'svelte';

  let showDialog = false;
  let folderId = '';
  let dialogError = '';

  function openFolderDialog() {
    showDialog = true;
    folderId = '';
    dialogError = '';
  }

  function closeDialog() {
    showDialog = false;
  }

  function handleSubmit() {
    // UUID v4 validation regex
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    if (!folderId.trim()) {
      dialogError = 'Please enter a folder ID';
      return;
    }

    if (!uuidRegex.test(folderId.trim())) {
      dialogError = 'Invalid folder ID format';
      return;
    }

    // Navigate to folder page
    goto(`/folder/${folderId.trim()}`);
    closeDialog();
  }

  // Close dialog when Escape key is pressed
  function handleKeydown(event: { key: string; }) {
    if (event.key === 'Escape' && showDialog) {
      closeDialog();
    }
  }

  onMount(() => {
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  });
</script>

<div class="container mx-auto py-16 px-4">
  <div class="flex flex-col items-center text-center max-w-3xl mx-auto">
    <h1 class="text-4xl md:text-5xl font-bold text-base-content">Sharing Photos Made Simple</h1>
    <p class="mt-4 text-xl text-base-content/70">
      Create secure folders to upload and share photos with anyone, protected by passwords.
    </p>

    <div class="my-12 flex flex-col sm:flex-row gap-4">
      <button class="btn btn-primary btn-lg rounded-full gap-2 text-primary-content" on:click={openFolderDialog}>
        <Icon icon="lucide:upload" class="h-5 w-5" />
        Upload Photos
      </button>

      <button class="btn btn-outline btn-lg rounded-full gap-2 text-primary-content" on:click={() => goto('/folder/create')}>
        <Icon icon="lucide:folder-plus" class="h-5 w-5" />
        Create An Event
      </button>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 w-full">
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body items-center text-center">
          <div class="rounded-full bg-primary/10 p-3 mb-4">
            <Icon icon="lucide:folder-plus" class="h-8 w-8 text-primary" />
          </div>
          <h2 class="card-title text-base-content">Create Folder</h2>
          <p class="text-base-content/70">
            Create a secure folder to organize and share your photos
          </p>
        </div>
      </div>
      
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body items-center text-center">
          <div class="rounded-full bg-primary/10 p-3 mb-4">
            <Icon icon="lucide:upload" class="h-8 w-8 text-primary" />
          </div>
          <h2 class="card-title text-base-content">Upload photos</h2>
          <p class="text-base-content/70">
            Upload photos to your folder securely with Google Cloud Storage
          </p>
        </div>
      </div>
      
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body items-center text-center">
          <div class="rounded-full bg-primary/10 p-3 mb-4">
            <Icon icon="lucide:image" class="h-8 w-8 text-primary" />
          </div>
          <h2 class="card-title text-base-content">Share Securely</h2>
          <p class="text-base-content/70">
            Share your folder link with optional password protection
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Folder ID Dialog -->
{#if showDialog}
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-base-100 rounded-lg shadow-xl max-w-md w-full p-6 relative">
      <button 
        class="absolute top-3 right-3 text-base-content/70 hover:text-base-content" 
        on:click={closeDialog}
      >
        <Icon icon="lucide:x" class="h-5 w-5" />
      </button>
      
      <h3 class="text-xl font-bold mb-4 text-base-content">Enter Folder ID</h3>
      
      <p class="text-base-content/70 mb-4">
        Enter a unique folder ID to access or upload photos to that folder
      </p>
      
      <form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-4">
        <div>
          <label for="folderId" class="block text-sm font-medium text-base-content/70 mb-1">
            Folder ID
          </label>
          <input 
            type="text" 
            id="folderId"
            bind:value={folderId}
            class="input input-bordered w-full"
            placeholder="e.g. c337f810-5ea7-44a7-a0db-d4b2f32e7d91"
            autocomplete="off"
          />
          {#if dialogError}
            <p class="text-error text-sm mt-1">{dialogError}</p>
          {/if}
        </div>
        
        <!-- <p class="text-xs text-base-content/60">
          Example format: c337f810-5ea7-44a7-a0db-d4b2f32e7d91
        </p> -->
        
        <div class="flex justify-end gap-2 mt-2">
          <button 
            type="button" 
            class="btn btn-ghost" 
            on:click={closeDialog}
          >
            Cancel
          </button>
          <button type="submit" class="btn btn-primary">
            Go to Folder
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}