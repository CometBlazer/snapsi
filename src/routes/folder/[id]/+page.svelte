<script lang="ts">
    //src/routes/folder/[id]/+page.svelte
    import { onMount } from 'svelte';
    import Icon from '@iconify/svelte';
    
    export let data;
    
    let password = '';
    let isAuthenticated = false;
    let isUploading = false;
    let uploadProgress = 0;
    let uploadError = '';
    let files: FileList | null = null;
    let shareUrl = '';
    let isRefreshing = false;
    let showShareDialog = false;
    let showDeleteDialog = false;
    let selectedImages: string[] = [];
    let isDeleting = false;
    let selectAllChecked = false;
    let isDownloading = false;
    
    $: folder = data.folder;
    $: images = data.images;
    $: remainingImagesCount = 20 - images.length;
    $: hasSelectedImages = selectedImages.length > 0;

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
      uploadError = '';
      
      const totalFiles = files.length;
      let successCount = 0;
      
      try {
        for (let i = 0; i < totalFiles; i++) {
          const file = files[i];
          
          // Check file size client-side as well
          if (file.size > 10 * 1024 * 1024) {
            uploadError = `File ${file.name} is too large. Maximum size is 10MB`;
            continue;
          }
          
          // Check file type client-side
          if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
            uploadError = `File ${file.name} has an invalid type. Only JPEG, PNG, GIF, and WebP are allowed`;
            continue;
          }
          
          // Create a FormData object
          const formData = new FormData();
          formData.append('file', file);
          formData.append('password', password);
          
          // Upload directly to our server endpoint
          const response = await fetch(`/api/upload/${folder.id}`, {
            method: 'POST',
            body: formData
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to upload file');
          }
          
          successCount++;
          uploadProgress = (successCount / totalFiles) * 100;
        }
        
        // Refresh the image list
        await refreshImages();
      } catch (error) {
        console.error('Error uploading files:', error);
        uploadError = error instanceof Error ? error.message : 'An error occurred during upload';
      } finally {
        isUploading = false;
        if (successCount > 0) {
          files = null; // Only clear the file input if at least one file was uploaded successfully
        }
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
          // Clear selections when refreshing
          selectedImages = [];
          selectAllChecked = false;
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
    
    function toggleSelectAll() {
      if (selectAllChecked) {
        // Select all images
        selectedImages = images.map(image => image.name);
      } else {
        // Deselect all
        selectedImages = [];
      }
    }
    
    function toggleImageSelection(imageName: string) {
      if (selectedImages.includes(imageName)) {
        // Remove from selection
        selectedImages = selectedImages.filter(name => name !== imageName);
      } else {
        // Add to selection
        selectedImages = [...selectedImages, imageName];
      }
      
      // Update "select all" checkbox state
      selectAllChecked = selectedImages.length === images.length;
    }
    
    async function deleteSelectedImages() {
      if (selectedImages.length === 0) return;
      
      isDeleting = true;
      
      try {
        for (const fileName of selectedImages) {
          await deleteImage(fileName);
        }
        
        // Refresh the image list
        await refreshImages();
      } catch (error) {
        console.error('Error deleting images:', error);
        alert(error instanceof Error ? error.message : 'An error occurred deleting images');
      } finally {
        isDeleting = false;
        showDeleteDialog = false;
      }
    }
    
    async function deleteImage(fileName: string) {
      try {
        const response = await fetch(`/api/folders/${folder.id}/images/${fileName}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ password })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete image');
        }
        
        return true;
      } catch (error) {
        console.error(`Error deleting image ${fileName}:`, error);
        throw error;
      }
    }
    
    // Updated download function that actually downloads the file
    async function downloadImage(imageUrl: string, imageName: string) {
      try {
        // Fetch the image from the signed URL
        const response = await fetch(imageUrl);
        if (!response.ok) {
          throw new Error('Failed to download image');
        }
        
        // Get the file as a blob
        const blob = await response.blob();
        
        // Create a URL for the blob
        const blobUrl = URL.createObjectURL(blob);
        
        // Create a link and trigger the download
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = imageName;
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error(`Error downloading image ${imageName}:`, error);
        alert(`Failed to download ${imageName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    // Download multiple selected images
    async function downloadSelectedImages() {
      if (selectedImages.length === 0) return;
      
      isDownloading = true;
      
      try {
        for (const imageName of selectedImages) {
          const image = images.find(img => img.name === imageName);
          if (image) {
            await downloadImage(image.url, image.name);
            // Small delay to prevent browser issues with multiple downloads
            await new Promise(resolve => setTimeout(resolve, 300));
          }
        }
      } catch (error) {
        console.error('Error downloading selected images:', error);
      } finally {
        isDownloading = false;
      }
    }
    
    // Create a zip file with selected images (if JSZip is available)
    async function downloadAsZip() {
      if (selectedImages.length === 0) return;
      
      try {
        // Import JSZip dynamically
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();
        
        isDownloading = true;
        
        // Add each selected image to the zip
        for (const imageName of selectedImages) {
          const image = images.find(img => img.name === imageName);
          if (image) {
            const response = await fetch(image.url);
            if (response.ok) {
              const blob = await response.blob();
              zip.file(image.name, blob);
            }
          }
        }
        
        // Generate the zip file
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        
        // Create a download link for the zip
        const zipUrl = URL.createObjectURL(zipBlob);
        const link = document.createElement('a');
        link.href = zipUrl;
        link.download = `${folder.name}_images.zip`;
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(zipUrl);
      } catch (error) {
        console.error('Error creating zip file:', error);
        alert('Failed to create zip file. Downloading images individually instead.');
        // Fall back to downloading images one by one
        await downloadSelectedImages();
      } finally {
        isDownloading = false;
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
                  <span class="label-text">Select Images ({remainingImagesCount} remaining)</span>
                </label>
                <input 
                  type="file" 
                  accept="image/jpeg,image/png,image/gif,image/webp" 
                  multiple 
                  bind:files 
                  disabled={isUploading || remainingImagesCount <= 0}
                  class="file-input file-input-bordered w-full"
                />
                <p class="text-xs text-base-content/70 mt-1">
                  Max 10MB per file, JPEG, PNG, GIF, WebP formats only. Maximum 20 images per folder.
                </p>
              </div>
              
              {#if isUploading}
                <div class="w-full">
                  <progress class="progress w-full" value={uploadProgress} max="100"></progress>
                  <p class="text-center text-sm text-base-content/70 mt-2">
                    Uploading... {Math.round(uploadProgress)}%
                  </p>
                </div>
              {/if}
              
              {#if uploadError}
                <div class="alert alert-error mt-2">
                  <Icon icon="lucide:alert-circle" class="h-4 w-4" />
                  <span>{uploadError}</span>
                </div>
              {/if}
              
              <button 
                class="btn btn-primary w-full" 
                on:click={handleUpload} 
                disabled={!files || files.length === 0 || isUploading || remainingImagesCount <= 0}
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
              
              {#if remainingImagesCount <= 0}
                <p class="text-error text-sm mt-2">
                  Maximum number of images reached (20). Delete some images to upload more.
                </p>
              {/if}
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
            <h2 class="text-xl font-semibold">Images ({images.length}/20)</h2>
            
            {#if images.length > 0}
              <div class="flex items-center gap-2">
                <div class="flex items-center gap-1">
                  <input 
                    type="checkbox" 
                    class="checkbox checkbox-sm" 
                    bind:checked={selectAllChecked} 
                    on:change={toggleSelectAll}
                  />
                  <span class="text-sm">Select All</span>
                </div>
                
                <div class="dropdown dropdown-end">
                  <button class="btn btn-sm" disabled={!hasSelectedImages}>
                    <Icon icon="lucide:more-horizontal" class="h-4 w-4" />
                    Selected ({selectedImages.length})
                  </button>
                  <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li>
                      <button on:click={downloadSelectedImages} disabled={!hasSelectedImages || isDownloading}>
                        <Icon icon="lucide:download" class="h-4 w-4" />
                        Download Files
                      </button>
                    </li>
                    <li>
                      <button on:click={downloadAsZip} disabled={!hasSelectedImages || isDownloading}>
                        <Icon icon="lucide:archive" class="h-4 w-4" />
                        Download as ZIP
                      </button>
                    </li>
                    <li>
                      <button on:click={() => showDeleteDialog = true} disabled={!hasSelectedImages} class="text-error">
                        <Icon icon="lucide:trash-2" class="h-4 w-4" />
                        Delete Selected
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            {/if}
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
                <div class="relative group">
                  <!-- Checkbox for selection -->
                  <div class="absolute top-2 left-2 z-10">
                    <input 
                      type="checkbox" 
                      class="checkbox checkbox-sm bg-white/80" 
                      checked={selectedImages.includes(image.name)} 
                      on:change={() => toggleImageSelection(image.name)}
                    />
                  </div>
                  
                  <!-- Image card -->
                  <div class="relative aspect-square rounded-lg overflow-hidden border bg-base-200">
                    <img
                      src={image.url}
                      alt={image.name}
                      class="h-full w-full object-cover transition-all group-hover:scale-105"
                    />
                    
                    <!-- Image info overlay -->
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                      <div class="flex justify-end">
                        <div class="flex gap-1">
                          <button 
                            class="btn btn-circle btn-xs bg-white/80 hover:bg-white"
                            on:click={() => downloadImage(image.url, image.name)}
                            title="Download image"
                          >
                            <Icon icon="lucide:download" class="h-3 w-3" />
                          </button>
                          
                          <button 
                            class="btn btn-circle btn-xs bg-white/80 hover:bg-white"
                            on:click={() => window.open(image.url, '_blank')}
                            title="View full size"
                          >
                            <Icon icon="lucide:external-link" class="h-3 w-3" />
                          </button>
                          
                          <button 
                            class="btn btn-circle btn-xs bg-white/80 hover:bg-white text-error"
                            on:click={async () => {
                              if (confirm(`Delete ${image.name}?`)) {
                                await deleteImage(image.name);
                                refreshImages();
                              }
                            }}
                            title="Delete image"
                          >
                            <Icon icon="lucide:trash-2" class="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      
                      <div class="w-full truncate text-white text-sm">
                        {image.name}
                      </div>
                    </div>
                  </div>
                </div>
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
  
  <!-- Delete Confirmation Dialog -->
  {#if showDeleteDialog}
    <div class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg text-error">Delete Selected Images</h3>
        <p class="py-4 text-base-content/70">
          Are you sure you want to delete {selectedImages.length} selected {selectedImages.length === 1 ? 'image' : 'images'}? 
          This action cannot be undone.
        </p>
        
        <div class="modal-action">
          <button class="btn" on:click={() => showDeleteDialog = false}>Cancel</button>
          <button 
            class="btn btn-error" 
            on:click={deleteSelectedImages}
            disabled={isDeleting}
          >
            {#if isDeleting}
              <span class="loading loading-spinner"></span>
              Deleting...
            {:else}
              Delete {selectedImages.length} {selectedImages.length === 1 ? 'Image' : 'Images'}
            {/if}
          </button>
        </div>
      </div>
      <div class="modal-backdrop" on:click={() => showDeleteDialog = false}></div>
    </div>
  {/if}
  
  <!-- Loading Overlay for Download Operations -->
  {#if isDownloading}
    <div class="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div class="bg-base-100 p-6 rounded-xl shadow-xl flex flex-col items-center">
        <span class="loading loading-spinner loading-lg"></span>
        <p class="mt-4">Preparing your download...</p>
      </div>
    </div>
  {/if}