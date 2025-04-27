<script lang="ts">
    //src/routes/folder/create/+page.svelte
    import { goto } from '$app/navigation';
    import Icon from '@iconify/svelte';
    
    let name = '';
    let password = '';
    let showPassword = false;
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
    
    function togglePasswordVisibility() {
      showPassword = !showPassword;
    }
  </script>

  <div class="container mx-auto max-w-2xl py-12 px-4">
    <div class="card bg-base-100 border-base-300 border-1 shadow-xl rounded-3xl p-8">
      <div class="card-body py-10">
        <div class="flex flex-col items-center text-center mb-6">
          <div class="rounded-full bg-primary/10 p-6 mb-4">
            <Icon icon="lucide:folder-plus" class="h-12 w-12 text-primary" />
          </div>
          <h2 class="text-3xl font-bold">Create New Folder</h2>
          <p class="text-base-content/70 mt-2 max-w-md">
            Create a secure folder where you and others can upload and share photos
          </p>
        </div>
        
        <form on:submit|preventDefault={handleCreateFolder} class="space-y-6">
          <div class="form-control w-full">
            <label for="name" class="block mb-2 font-medium">
              Folder Name
            </label>
            <input 
              id="name" 
              type="text" 
              bind:value={name} 
              placeholder="My Awesome Folder" 
              required 
              class="input input-bordered w-full rounded-xl" 
              aria-describedby="name-help"
            />
            <p id="name-help" class="text-xs text-base-content/70 mt-2">
              Choose a descriptive name for your folder
            </p>
          </div>
          
          <div class="form-control w-full">
            <label for="password" class="block mb-2 font-medium">
              Password (Optional)
            </label>
            <div class="relative">
              <input 
                id="password" 
                type={showPassword ? "text" : "password"} 
                bind:value={password} 
                placeholder="Leave blank for no password protection" 
                class="input input-bordered w-full rounded-xl pr-10" 
                aria-describedby="password-help"
              />
              <button 
                type="button" 
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/70 hover:text-base-content"
                on:click={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <Icon icon={showPassword ? "lucide:eye-off" : "lucide:eye"} class="h-5 w-5" />
              </button>
            </div>
            <p id="password-help" class="text-xs text-base-content/70 mt-2">
              If provided, this password will be needed to view and upload images
            </p>
          </div>
          
          {#if error}
            <div class="alert alert-error rounded-lg" role="alert">
              <Icon icon="lucide:alert-circle" class="h-4 w-4" />
              <span>{error}</span>
            </div>
          {/if}
          
          <div class="flex justify-center pt-4">
            <button 
              type="submit" 
              class="btn btn-primary btn-lg rounded-full px-10" 
              disabled={isCreating}
            >
              {#if isCreating}
                <span class="loading loading-spinner"></span>
                Creating...
              {:else}
              <Icon icon="lucide:check-circle" class="h-5 w-5 mr-2" />
                Finish Creating Folder
              {/if}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>