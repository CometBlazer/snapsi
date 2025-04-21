<script lang="ts">
    //src/routes/folder/[id]/+page.svelte
    import { onMount } from 'svelte';
    import Icon from '@iconify/svelte';
    
    export let data;
    
    let password = '';
    let isAuthenticated = false;
    let isUploading = false;
    let uploadProgress = 0;
    let files: FileList | null = null;
    let shareUrl = '';
    let isRefreshing = false;
    let showShareDialog = false;
    
    $: folder = data.folder;
    $: images = data.images;

    onMount(() => {
      shareUrl = window.location.href;
      
      // If the folder doesn't have a password, auto-authenticate
      if (!folder.hasPassword) {
        isAuthenticated = true;
      }
    });
    
    async function verifyPassword() {
      try {
        const response = await fetch(`/api/folders/${folder.id}/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ password })
        });
        
        if (response.ok) {
          isAuthenticated = true;
        } else {
          const data = await response.json();
          alert(data.message || 'Invalid password');
        }
      } catch (error) {
        console.error('Error verifying password:', error);
      }
    }
    
    async function handleUpload() {
      if (!files || files.length === 0) {
        return;
      }
      
      isUploading = true;
      uploadProgress = 0;
      
      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          
          // Get a signed URL for upload
          const response = await fetch(`/api/upload/${folder.id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
              fileName: file.name,
              contentType: file.type,
              password
            })
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to get upload URL');
          }
          
          const { url } = await response.json();
          
          // Upload file directly to Google Cloud Storage
          await fetch(url, {
            method: 'PUT',
            headers: {
              'Content-Type': file.type
            },
            body: file
          });
          
          uploadProgress = ((i + 1) / files.length) * 100;
        }
        
        // Refresh the image list
        await refreshImages();
      } catch (error) {
        console.error('Error uploading files:', error);
        alert(error instanceof Error ? error.message : 'An error occurred during upload');
      } finally {
        isUploading = false;
        files = null;
      }
    }
    
    function copyShareUrl() {
      navigator.clipboard.writeText(shareUrl);
    }
    
    async function refreshImages() {
      isRefreshing = true;
      
      try {
        const response = await fetch(`/api/folders/${folder.id}/images`);
        if (response.ok) {
          const refreshedImages = await response.json();
          images = refreshedImages;
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to refresh images');
        }
      } catch (error) {
        console.error('Error refreshing images:', error);
      } finally {
        isRefreshing = false;
      }
    }
  </script>

  <div class="container mx-auto py-8 px-4">
    <div class="flex flex-col gap-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold">{folder.name}</h1>
          <p class="text-base-content/70">Created: {new Date(folder.createdAt).toLocaleDateString()}</p>
        </div>
        
        <div class="flex flex-wrap gap-2">
          <button class="btn btn-outline btn-sm gap-2" on:click={refreshImages} disabled={isRefreshing}>
            <Icon icon="lucide:refresh-cw" class="h-4 w-4" />
            Refresh
          </button>
          
          <button class="btn btn-outline btn-sm gap-2" on:click={() => showShareDialog = true}>
            <Icon icon="lucide:share" class="h-4 w-4" />
            Share
          </button>
        </div>
      </div>
      
      {#if !isAuthenticated}
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body items-center text-center">
            <Icon icon="lucide:lock" class="h-12 w-12 text-base-content/70" />
            <h2 class="text-xl font-semibold">Authentication Required</h2>
            <p class="text-base-content/70">
              Enter the folder password to view and upload images
            </p>
            <div class="w-full max-w-sm flex gap-2">
              <input 
                type="password" 
                bind:value={password} 
                placeholder="Enter password" 
                class="input input-bordered flex-1"
              />
              <button class="btn btn-primary" on:click={verifyPassword}>Unlock</button>
            </div>
          </div>
        </div>
      {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Image upload section -->
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body items-center text-center">
              <Icon icon="lucide:upload" class="h-10 w-10 text-base-content/70" />
              <h2 class="text-xl font-semibold">Upload Images</h2>
              
              <div class="w-full">
                <label class="label">
                  <span class="label-text">Select Images</span>
                </label>
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  bind:files 
                  disabled={isUploading}
                  class="file-input file-input-bordered w-full"
                />
              </div>
              
              {#if isUploading}
                <div class="w-full">
                  <progress class="progress w-full" value={uploadProgress} max="100"></progress>
                  <p class="text-center text-sm text-base-content/70 mt-2">
                    Uploading... {Math.round(uploadProgress)}%
                  </p>
                </div>
              {/if}
              
              <button 
                class="btn btn-primary w-full" 
                on:click={handleUpload} 
                disabled={!files || files.length === 0 || isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
          
          <!-- Share information -->
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body items-center text-center">
              <Icon icon="lucide:share" class="h-10 w-10 text-base-content/70" />
              <h2 class="text-xl font-semibold">Share Instructions</h2>
              
              <div class="space-y-4 w-full">
                <div>
                  <label class="label">
                    <span class="label-text">Share Link</span>
                  </label>
                  <div class="join w-full">
                    <input value={shareUrl} readonly class="input input-bordered join-item flex-1" />
                    <button class="btn join-item" on:click={copyShareUrl}>
                      <Icon icon="lucide:copy" class="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {#if folder.hasPassword}
                <div>
                  <label class="label">
                    <span class="label-text">Folder Password</span>
                  </label>
                  <p class="text-sm text-base-content/70">
                    Remember to share the password with people who need to view or upload images.
                  </p>
                </div>
                {:else}
                <div>
                  <p class="text-sm text-base-content/70">
                    This folder is not password protected. Anyone with the link can view and upload images.
                  </p>
                </div>
                {/if}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Image gallery -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold">Images ({images.length})</h2>
          </div>
          
          {#if images.length === 0}
            <div class="flex flex-col items-center justify-center py-10 text-center">
              <Icon icon="lucide:image" class="h-16 w-16 text-base-content/70" />
              <h3 class="mt-4 text-lg font-medium">No images yet</h3>
              <p class="mt-1 text-base-content/70">
                Upload images or share this folder with others to get started
              </p>
            </div>
          {:else}
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {#each images as image}
                <a href={image.url} target="_blank" rel="noopener noreferrer" class="group">
                  <div class="relative aspect-square rounded-lg overflow-hidden border bg-base-200">
                    <img
                      src={image.url}
                      alt={image.name}
                      class="h-full w-full object-cover transition-all group-hover:scale-105"
                    />
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                      <div class="p-2 w-full truncate text-white text-sm">
                        {image.name}
                      </div>
                    </div>
                  </div>
                </a>
              {/each}
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div>

  <!-- Share Dialog -->
  {#if showShareDialog}
    <div class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Share this folder</h3>
        <p class="py-4 text-base-content/70">
          Anyone with this link can view and upload to this folder
          {#if folder.hasPassword}
          (with password)
          {:else}
          (no password required)
          {/if}
        </p>
        <div class="join w-full">
          <input value={shareUrl} readonly class="input input-bordered join-item flex-1" />
          <button class="btn join-item" on:click={copyShareUrl}>
            <Icon icon="lucide:copy" class="h-4 w-4" />
          </button>
        </div>
        <div class="modal-action">
          <button class="btn" on:click={() => showShareDialog = false}>Close</button>
          <button class="btn btn-primary" on:click={() => { copyShareUrl(); showShareDialog = false; }}>
            Copy Link
          </button>
        </div>
      </div>
      <div class="modal-backdrop" on:click={() => showShareDialog = false}></div>
    </div>
  {/if}