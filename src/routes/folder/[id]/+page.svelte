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
    let showUploadDialog = false;
    let showDeleteDialog = false;
    let selectedImages: string[] = [];
    let isDeleting = false;
    let selectAllChecked = false;
    let isDownloading = false;
    let showPassword = false;
    let displayedPassword = '';
    
    $: folder = data.folder;
    $: images = data.images;
    $: MAX_IMAGE_COUNT = 20;
    $: currentImageCount = images.length;
    $: remainingImagesCount = MAX_IMAGE_COUNT - currentImageCount;
    $: hasSelectedImages = selectedImages.length > 0;
    $: pendingImageCount = files ? files.length : 0;
    $: exceededLimit = currentImageCount + pendingImageCount > MAX_IMAGE_COUNT;

    onMount(() => {
      shareUrl = window.location.href;
      
      // If the folder doesn't have a password, auto-authenticate
      if (!folder.hasPassword) {
        isAuthenticated = true;
      }

      // Retrieve stored password for display if folder has password
      if (folder.hasPassword) {
        getStoredPassword();
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

    async function getStoredPassword() {
      try {
        const response = await fetch(`/api/folders/${folder.id}/password`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          displayedPassword = data.password;
        }
      } catch (error) {
        console.error('Error retrieving password:', error);
      }
    }
    
    async function handleUpload() {
      if (!files || files.length === 0) {
        return;
      }
      
      // Check if total would exceed max count
      if (currentImageCount + files.length > MAX_IMAGE_COUNT) {
        const allowedCount = MAX_IMAGE_COUNT - currentImageCount;
        
        if (allowedCount <= 0) {
          uploadError = `Maximum number of images (${MAX_IMAGE_COUNT}) reached. Delete some images to upload more.`;
          return;
        }
        
        // Alert user that only some files will be uploaded
        alert(`Only ${allowedCount} of ${files.length} files will be uploaded to stay within the limit of ${MAX_IMAGE_COUNT} images.`);
      }
      
      isUploading = true;
      uploadProgress = 0;
      uploadError = '';
      
      const totalFiles = files.length;
      let successCount = 0;
      
      try {
        for (let i = 0; i < totalFiles; i++) {
          // Stop uploading if we hit the max limit
          if (currentImageCount + successCount >= MAX_IMAGE_COUNT) {
            break;
          }
          
          const file = files[i];
          
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
          uploadProgress = (successCount / Math.min(totalFiles, MAX_IMAGE_COUNT - currentImageCount)) * 100;
        }
        
        // Update the current image count based on successful uploads
        currentImageCount += successCount;
        
        // Refresh the image list
        await refreshImages();
        // Close upload dialog after successful upload
        showUploadDialog = false;
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

    function copyPassword() {
      navigator.clipboard.writeText(displayedPassword);
    }
    
    async function refreshImages() {
      isRefreshing = true;
      
      try {
        // First, get updated folder data to get the latest image_count
        const folderResponse = await fetch(`/api/folders/${folder.id}`);
        if (folderResponse.ok) {
          const updatedFolder = await folderResponse.json();
          folder = updatedFolder;
        }
        
        // Then, get updated image list
        const imagesResponse = await fetch(`/api/folders/${folder.id}/images`);
        if (imagesResponse.ok) {
          const refreshedImages = await imagesResponse.json();
          images = refreshedImages;
          // Clear selections when refreshing
          selectedImages = [];
          selectAllChecked = false;
        } else {
          const errorData = await imagesResponse.json();
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
        
        // Update our local count
        if (currentImageCount > 0) {
          currentImageCount--;
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

    function togglePasswordVisibility() {
      showPassword = !showPassword;
    }
  </script>

  <div class="container mx-auto py-8 px-4">
    <div class="flex flex-col gap-6">
      <div>
        <h1 class="text-3xl font-bold mb-1">{folder.name}</h1>
        <p class="text-base-content/70">Created: {new Date(folder.createdAt).toLocaleDateString()}</p>
      </div>
      {#if !isAuthenticated}
        <div class="card bg-base-100 shadow-xl border-base-300 border-1">
          <div class="card-body items-center text-center py-20">
            <div class="rounded-full bg-primary/10 p-6 mb-6">
              <Icon icon="lucide:lock" class="h-16 w-16 text-primary" />
            </div>
            <h2 class="text-2xl font-semibold mb-2">Authentication Required</h2>
            <p class="text-base-content/70 mb-6 max-w-md">
              This folder is password protected. Enter the password to view and upload images.
            </p>
            <div class="w-full max-w-sm">
              <div class="relative w-full mb-4">
                <input 
                  type={showPassword ? "text" : "password"}
                  bind:value={password} 
                  placeholder="Enter password" 
                  class="input input-bordered w-full rounded-xl pr-10"
                />
                <button 
                  type="button" 
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/70 hover:text-base-content"
                  on:click={togglePasswordVisibility}
                >
                  <Icon icon={showPassword ? "lucide:eye-off" : "lucide:eye"} class="h-5 w-5" />
                </button>
              </div>
              <button class="btn btn-primary w-full rounded-xl" on:click={verifyPassword}>Unlock Folder</button>
            </div>
          </div>
        </div>
      {:else}
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">          
          <div class="flex flex-wrap gap-2">
            <button class="btn btn-outline btn-sm gap-2 rounded-full" on:click={refreshImages} disabled={isRefreshing}>
              <Icon icon="lucide:refresh-cw" class="h-4 w-4" />
              Refresh
            </button>
            
            <button class="btn btn-outline btn-sm gap-2 rounded-full" on:click={() => showUploadDialog = true}>
              <Icon icon="lucide:upload" class="h-4 w-4" />
              Upload
            </button>
            
            <button class="btn btn-outline btn-sm gap-2 rounded-full" on:click={() => showShareDialog = true}>
              <Icon icon="lucide:share" class="h-4 w-4" />
              Share
            </button>
          </div>
        </div>
        
        <!-- Image gallery -->
        <div>
          <div class="flex items-center justify-between mt-3 mb-6">
            <h2 class="text-xl font-semibold flex-row items-center gap-4">
              <span>{images.length} Image(s)</span>
              {#if images.length > 0}
                <span class="text-xs bg-base-200 ml-2 px-2 py-1 rounded-full text-base-content/70">
                  Max {MAX_IMAGE_COUNT} allowed
                </span>
              {/if}
            </h2>
            
            {#if images.length > 0}
              <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                  <label class="cursor-pointer flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      class="checkbox checkbox-sm checkbox-secondary rounded-md" 
                      bind:checked={selectAllChecked} 
                      on:change={toggleSelectAll}
                    />
                    <span class="text-sm">Select All</span>
                  </label>
                </div>
                
                <div class="dropdown dropdown-end">
                  <button class="btn btn-sm rounded-full" disabled={!hasSelectedImages}>
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
            <div class="flex flex-col items-center justify-center py-16 text-center bg-base-200 rounded-xl">
              <div class="rounded-full bg-base-100 p-6 mb-4">
                <Icon icon="lucide:image" class="h-16 w-16 text-base-content/50" />
              </div>
              <h3 class="text-xl font-medium">No images yet</h3>
              <p class="mt-2 text-base-content/70 max-w-md">
                Upload images or share this folder with others to get started
              </p>
              <button 
                class="btn btn-primary mt-4 md:hidden rounded-xl" 
                on:click={() => showUploadDialog = true}
              >
                <Icon icon="lucide:upload" class="h-4 w-4 mr-2" />
                Upload Photos
              </button>
            </div>
          {:else}
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {#each images as image}
                <div class="relative group">
                  <!-- Checkbox for selection -->
                  <div class="absolute top-2 left-2 sm:top-4 sm:left-4 z-10">
                    <input 
                      type="checkbox" 
                      class="checkbox checkbox-secondary checkbox-md rounded-md border-1 bg-base-100" 
                      checked={selectedImages.includes(image.name)} 
                      on:change={() => toggleImageSelection(image.name)}
                    />
                  </div>
                  
                  <!-- Image card -->
                  <div class="relative aspect-square rounded-xl overflow-hidden border bg-base-200">
                    <img
                      src={image.url}
                      alt={image.name}
                      class="h-full w-full object-cover transition-all group-hover:scale-105"
                    />
                    
                    <!-- Image info overlay -->
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 sm:p-4">
                      <div class="flex justify-end">
                        <div class="flex gap-1">
                          <button 
                            class="btn btn-circle btn-sm bg-white/80 hover:bg-white"
                            on:click={() => downloadImage(image.url, image.name)}
                            title="Download image"
                          >
                            <Icon icon="lucide:download" class="h-4 w-4" />
                          </button>
                          
                          <button 
                            class="btn btn-circle btn-sm bg-white/80 hover:bg-white"
                            on:click={() => window.open(image.url, '_blank')}
                            title="View full size"
                          >
                            <Icon icon="lucide:external-link" class="h-4 w-4" />
                          </button>
                          
                          <button 
                            class="btn btn-circle btn-sm bg-white/80 hover:bg-white text-error"
                            on:click={async () => {
                              if (confirm(`Delete ${image.name}?`)) {
                                await deleteImage(image.name);
                                refreshImages();
                              }
                            }}
                            title="Delete image"
                          >
                            <Icon icon="lucide:trash-2" class="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div class="w-full truncate text-white text-sm font-medium px-1">
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
      <div class="modal-box rounded-xl">
        <h3 class="font-bold text-lg">Share this folder</h3>
        
        <div class="space-y-4 mt-4">
          <div>
            <label class="label mb-2">
              <span class="label-text font-medium">Share Link</span>
            </label>
            <div class="join w-full">
              <input value={shareUrl} readonly class="input input-bordered join-item flex-1 rounded-l-lg" />
              <button class="btn join-item rounded-r-lg" on:click={copyShareUrl}>
                <Icon icon="lucide:copy" class="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {#if folder.hasPassword}
            <div>
              <label class="label mb-2">
                <span class="label-text font-medium">Password</span>
              </label>
              <div class="join w-full">
                <input value={displayedPassword} readonly class="input input-bordered join-item flex-1 rounded-l-lg" />
                <button class="btn join-item rounded-r-lg" on:click={copyPassword}>
                  <Icon icon="lucide:copy" class="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div class="p-4 bg-base-200 rounded-xl mt-4">
              <div class="flex items-center gap-2 mb-2">
                <Icon icon="lucide:shield" class="h-5 w-5 text-primary" />
                <span class="font-medium">Password Protected</span>
              </div>
              <p class="text-sm text-base-content/70">
                Remember to share the password with people who need to view or upload images.
              </p>
            </div>
          {:else}
            <div class="p-4 bg-base-200 rounded-xl mt-4">
              <div class="flex items-center gap-2 mb-2">
                <Icon icon="lucide:alert-triangle" class="h-5 w-5 text-warning" />
                <span class="font-medium">Public Folder</span>
              </div>
              <p class="text-sm text-base-content/70">
                This folder is not password protected. Anyone with the link can view and upload images.
              </p>
            </div>
          {/if}
        </div>
        
        <div class="modal-action">
          <button class="btn rounded-full" on:click={() => showShareDialog = false}>Close</button>
          <button class="btn btn-primary rounded-full" on:click={() => { copyShareUrl(); showShareDialog = false; }}>
            Copy Link
          </button>
        </div>
      </div>
      <div class="modal-backdrop" on:click={() => showShareDialog = false}></div>
    </div>
  {/if}

  <!-- Upload Dialog -->
  {#if showUploadDialog}
    <div class="modal modal-open">
      <div class="modal-box rounded-xl">
        <h3 class="font-bold text-lg">Upload Images</h3>
        
        <div class="w-full mt-4">
          <label class="label mb-2">
            <span class="label-text font-medium">Select Images</span>
            <span class="label-text-alt">{remainingImagesCount} of {MAX_IMAGE_COUNT} remaining</span>
          </label>
          <input 
            type="file" 
            accept="image/jpeg,image/png,image/gif,image/webp" 
            multiple 
            bind:files 
            disabled={isUploading}
            class="file-input file-input-bordered w-full rounded-lg"
          />
          <p class="text-xs text-base-content/70 mt-2">
            Supported formats: JPEG, PNG, GIF, WebP.
          </p>

          {#if exceededLimit}
            <div class="alert alert-warning mt-4 rounded-lg">
              <Icon icon="lucide:alert-triangle" class="h-4 w-4" />
              <span>You've selected {pendingImageCount} files, but only {remainingImagesCount} more can be added to stay within the {MAX_IMAGE_COUNT} image limit.</span>
            </div>
          {/if}
        </div>
        
        {#if isUploading}
          <div class="w-full mt-4">
            <progress class="progress progress-primary w-full" value={uploadProgress} max="100"></progress>
            <p class="text-center text-sm text-base-content/70 mt-2">
              Uploading... {Math.round(uploadProgress)}%
            </p>
          </div>
        {/if}
        
        {#if uploadError}
          <div class="alert alert-error mt-4 rounded-lg">
            <Icon icon="lucide:alert-circle" class="h-4 w-4" />
            <span>{uploadError}</span>
          </div>
        {/if}
        
        <div class="modal-action">
          <button class="btn rounded-full" on:click={() => showUploadDialog = false} disabled={isUploading}>Cancel</button>
          <button 
            class="btn btn-primary rounded-full" 
            on:click={handleUpload} 
            disabled={!files || files.length === 0 || isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload Photos'}
          </button>
        </div>
      </div>
      <div class="modal-backdrop" on:click={() => isUploading ? null : (showUploadDialog = false)}></div>
    </div>
  {/if}

  <!-- Delete Confirmation Dialog -->
  {#if showDeleteDialog}
    <div class="modal modal-open">
      <div class="modal-box rounded-xl">
        <h3 class="font-bold text-lg text-error">Delete Selected Images</h3>
        <p class="py-4 text-base-content/70">
          Are you sure you want to delete {selectedImages.length} selected {selectedImages.length === 1 ? 'image' : 'images'}? 
          This action cannot be undone.
        </p>
        
        <div class="modal-action">
          <button class="btn rounded-full" on:click={() => showDeleteDialog = false}>Cancel</button>
          <button 
            class="btn btn-error rounded-full" 
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