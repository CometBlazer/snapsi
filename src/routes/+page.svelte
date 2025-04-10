<script lang="ts">
    import { goto } from '$app/navigation';
    import { Button } from '$lib/components/ui/button';
    import { FolderPlus, Upload, Image } from 'lucide-svelte';
  </script>
  
  <div class="container mx-auto py-16 px-4">
    <div class="flex flex-col items-center text-center max-w-3xl mx-auto">
      <h1 class="text-4xl md:text-5xl font-bold">Secure Image Sharing</h1>
      <p class="mt-4 text-xl text-muted-foreground">
        Create secure folders to upload and share images with anyone, protected by passwords.
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 w-full">
        <div class="flex flex-col items-center p-6 bg-card rounded-lg border shadow-sm">
          <div class="p-3 rounded-full bg-primary/10 mb-4">
            <FolderPlus class="h-8 w-8 text-primary" />
          </div>
          <h2 class="text-xl font-semibold">Create Folder</h2>
          <p class="text-muted-foreground text-center mt-2">
            Create a secure folder to organize and share your images
          </p>
        </div>
        
        <div class="flex flex-col items-center p-6 bg-card rounded-lg border shadow-sm">
          <div class="p-3 rounded-full bg-primary/10 mb-4">
            <Upload class="h-8 w-8 text-primary" />
          </div>
          <h2 class="text-xl font-semibold">Upload Images</h2>
          <p class="text-muted-foreground text-center mt-2">
            Upload images to your folder securely with Google Cloud Storage
          </p>
        </div>
        
        <div class="flex flex-col items-center p-6 bg-card rounded-lg border shadow-sm">
          <div class="p-3 rounded-full bg-primary/10 mb-4">
            <Image class="h-8 w-8 text-primary" />
          </div>
          <h2 class="text-xl font-semibold">Share Securely</h2>
          <p class="text-muted-foreground text-center mt-2">
            Share your folder link with password protection
          </p>
        </div>
      </div>
      
      <div class="mt-12">
        <Button size="lg" on:click={() => goto('/folder/create')}>
          <FolderPlus class="h-5 w-5 mr-2" />
          Create New Folder
        </Button>
      </div>
    </div>
  </div>