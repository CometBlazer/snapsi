<script lang="ts">
  import { goto } from '$app/navigation';
  import Icon from '@iconify/svelte';
</script>

<div class="container mx-auto py-16 px-4">
  <div class="flex flex-col items-center text-center max-w-3xl mx-auto">
    <h1 class="text-4xl md:text-5xl font-bold text-base-content">Sharing Images Made Simple</h1>
    <p class="mt-4 text-xl text-base-content/70">
      Create secure folders to upload and share images with anyone, protected by passwords.
    </p>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 w-full">
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body items-center text-center">
          <div class="rounded-full bg-primary/10 p-3 mb-4">
            <Icon icon="lucide:folder-plus" class="h-8 w-8 text-primary" />
          </div>
          <h2 class="card-title text-base-content">Create Folder</h2>
          <p class="text-base-content/70">
            Create a secure folder to organize and share your images
          </p>
        </div>
      </div>
      
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body items-center text-center">
          <div class="rounded-full bg-primary/10 p-3 mb-4">
            <Icon icon="lucide:upload" class="h-8 w-8 text-primary" />
          </div>
          <h2 class="card-title text-base-content">Upload Images</h2>
          <p class="text-base-content/70">
            Upload images to your folder securely with Google Cloud Storage
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
            Share your folder link with password protection
          </p>
        </div>
      </div>
    </div>
    
    <div class="mt-12">
      <button class="btn btn-primary btn-lg gap-2 text-primary-content" on:click={() => goto('/folder/create')}>
        <Icon icon="lucide:folder-plus" class="h-5 w-5" />
        Create An Event
      </button>
    </div>
  </div>
</div>