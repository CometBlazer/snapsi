<script lang="ts">
    //src/routes/folder/create/+page.svelte
    import { goto } from '$app/navigation';
    import Icon from '@iconify/svelte';
    
    let name = '';
    let password = '';
    let isCreating = false;
    let error = '';
    
    async function handleCreateFolder() {
      if (!name) {
        error = 'Folder name is required';
        return;
      }
      
      isCreating = true;
      error = '';
      
      try {
        const response = await fetch('/api/folders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            name, 
            password: password.trim() === '' ? null : password 
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create folder');
        }
        
        const folder = await response.json();
        goto(`/folder/${folder.id}`);
      } catch (err) {
        error = err instanceof Error ? err.message : 'An unexpected error occurred';
      } finally {
        isCreating = false;
      }
    }
  </script>

  <div class="container mx-auto max-w-md py-10">
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="flex items-center gap-2">
          <Icon icon="lucide:folder-plus" class="h-6 w-6" />
          <h2 class="card-title">Create New Folder</h2>
        </div>
        <p class="text-base-content/70">Create a folder where others can upload images</p>
        
        <form on:submit|preventDefault={handleCreateFolder} class="space-y-4 mt-4">
          <div class="form-control w-full">
            <label for="name" class="label">
              <span class="label-text">Folder Name</span>
            </label>
            <input 
              id="name" 
              type="text" 
              bind:value={name} 
              placeholder="My Awesome Folder" 
              required 
              class="input input-bordered w-full" 
            />
          </div>
          
          <div class="form-control w-full">
            <label for="password" class="label">
              <span class="label-text">Password (Optional)</span>
            </label>
            <input 
              id="password" 
              type="text" 
              bind:value={password} 
              placeholder="Leave blank for no password protection" 
              class="input input-bordered w-full" 
            />
            <label class="label">
              <span class="label-text-alt text-base-content/70">
                If provided, this password will be needed to view and upload images
              </span>
            </label>
          </div>
          
          {#if error}
            <div class="text-error text-sm">{error}</div>
          {/if}
          
          <button 
            type="submit" 
            class="btn btn-primary w-full rounded-full" 
            disabled={isCreating}
          >
            {#if isCreating}
              <span class="loading loading-spinner"></span>
              Creating...
            {:else}
              Create Folder
            {/if}
          </button>
        </form>
      </div>
    </div>
  </div>