<script lang="ts">
  // src/routes/+page.svelte
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
    <h1 class="text-4xl md:text-5xl font-bold text-base-content">Sharing Photos Made <span class="text-secondary font-extrabold">Simple</span></h1>
    <p class="mt-4 text-xl text-base-content/70">
      Create <b>private, secure</b> folders to upload and share photos with anyone, protected by passwords.
    </p>

    <div class="my-12 flex flex-col sm:flex-row gap-4">
      <button class="btn btn-primary btn-lg rounded-full gap-2 text-primary-content" on:click={openFolderDialog}>
        <Icon icon="lucide:eye" class="h-5 w-5" />
        View Your Photos
      </button>

      <button class="btn btn-outline btn-lg rounded-full gap-2 text-primary-content" on:click={() => goto('/folder/create')}>
        <Icon icon="lucide:folder-plus" class="h-5 w-5" />
        Create A Folder
      </button>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 w-full">
      <div class="card bg-base-100 border-base-300 border-1 shadow-xl">
        <div class="card-body items-center text-center">
          <div class="rounded-full bg-primary/10 p-3 mb-4">
            <Icon icon="lucide:folder-plus" class="h-8 w-8 text-primary" />
          </div>
          <h2 class="card-title text-base-content">1. Create Folder.</h2>
          <p class="text-base-content/70">
            Create a private folder to organize and share your photos
          </p>
        </div>
      </div>
      
      <div class="card bg-base-100 border-base-300 border-1 shadow-xl">
        <div class="card-body items-center text-center">
          <div class="rounded-full bg-primary/10 p-3 mb-4">
            <Icon icon="lucide:upload" class="h-8 w-8 text-primary" />
          </div>
          <h2 class="card-title text-base-content">2. Upload photos.</h2>
          <p class="text-base-content/70">
            Securely upload photos to your folder
          </p>
        </div>
      </div>
      
      <div class="card bg-base-100 border-base-300 border-1 shadow-xl">
        <div class="card-body items-center text-center">
          <div class="rounded-full bg-primary/10 p-3 mb-4">
            <Icon icon="lucide:image" class="h-8 w-8 text-primary" />
          </div>
          <h2 class="card-title text-base-content">3. Share Securely!</h2>
          <p class="text-base-content/70">
            Share your unique folder link with optional password protection
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="container mx-auto py-16 px-4 max-w-5xl">
  <h2 class="text-3xl md:text-4xl font-bold text-base-content text-center mb-10">Frequently Asked Questions</h2>
  <div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
    <input type="checkbox" />
    <div class="collapse-title text-xl font-medium">
      Is this secure? 
    </div>
    <div class="collapse-content">
      <p>Yes, we take the security of your photos seriously. All images are securely uploaded to a private Google Cloud Storage bucket, and all image retreivals are through signed URLs that expire after 24 hours. Your images are <b>private to YOU</b> and never shared with any third parties. You can also delete your images at any time.</p>
    </div>
  </div> 

  <div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box mt-4">
    <input type="checkbox" />
    <div class="collapse-title text-xl font-medium">
      What is this service for? 
    </div>
    <div class="collapse-content">
      <p>
        This service is for people who want to <b>quickly share large amounts of photos with friends and family</b>. It is perfect for events like weddings, parties, or vacations where you want to share a lot of photos with a group of people. Just create a folder, upload your photos, and share your unique link to your friends for them to view, download, and upload their own photos. You can also protect your folder with a password for added security.
      </p>
    </div>
  </div> 

  <div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box mt-4">
    <input type="checkbox" />
    <div class="collapse-title text-xl font-medium">
      Is this service free? 
    </div>
    <div class="collapse-content">
      <p>
        Yes, this service is completely <b>free to use</b>! We are currently in beta and will be adding more features in the future. If you have any feedback or suggestions, please let us know! (direct message u/hydrocomet on Reddit)
      </p>
    </div>
  </div> 

  <div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box mt-4">
    <input type="checkbox" />
    <div class="collapse-title text-xl font-medium">
      How do I share my folder?
    </div>
    <div class="collapse-content">
      <p>You can share your folder by copying the share link and optionally protecting it with a password. Remember, your link is private and should only be shared with people you trust.</p>
    </div>
  </div>

  <div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box mt-4">
    <input type="checkbox" />
    <div class="collapse-title text-xl font-medium">
      What are limits on the number of photos I can upload and the size of each photo?
    </div>
    <div class="collapse-content">
      <p>Each folder has a limit of 100 photos, and each photo can be up to 500 MB in size.</p>
    </div>
  </div>
</div>

<!-- Folder ID Dialog -->
{#if showDialog}
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-base-100 rounded-xl shadow-xl max-w-md w-full p-8 relative">
      <button 
        class="absolute top-4 right-4 text-base-content/70 hover:text-base-content" 
        on:click={closeDialog}
      >
        <Icon icon="lucide:x" class="h-5 w-5" />
      </button>
      
      <h3 class="text-xl font-bold mb-4 text-base-content">Enter Your Folder ID</h3>
      
      <p class="text-base-content/70 mb-4">
        Enter your unique folder ID to view and access your photos
      </p>
      
      <form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-4">
        <div>
          <label for="folderId" class="block text-sm font-medium text-base-content/70 mb-2">
            Folder ID
          </label>
          <input 
            type="text" 
            id="folderId"
            bind:value={folderId}
            class="input input-bordered w-full rounded-xl"
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
            class="btn btn-ghost rounded-full" 
            on:click={closeDialog}
          >
            Cancel
          </button>
          <button type="submit" class="btn btn-primary rounded-full">
            Go to Folder
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}