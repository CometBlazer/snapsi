<script lang="ts">
    import { goto } from '$app/navigation';
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { Label } from '$lib/components/ui/label';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
    import { FolderPlus } from 'lucide-svelte';
    
    let name = '';
    let password = '';
    let isCreating = false;
    let error = '';
    
    async function handleCreateFolder() {
      if (!name || !password) {
        error = 'Please fill in all fields';
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
          body: JSON.stringify({ name, password })
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
    <Card>
      <CardHeader>
        <div class="flex items-center gap-2">
          <FolderPlus class="h-6 w-6" />
          <CardTitle>Create New Folder</CardTitle>
        </div>
        <CardDescription>Create a folder where others can upload images</CardDescription>
      </CardHeader>
      <CardContent>
        <form on:submit|preventDefault={handleCreateFolder} class="space-y-4">
          <div class="space-y-2">
            <Label for="name">Folder Name</Label>
            <Input id="name" bind:value={name} placeholder="My Awesome Folder" required />
          </div>
          
          <div class="space-y-2">
            <Label for="password">Password</Label>
            <Input id="password" type="password" bind:value={password} placeholder="••••••••" required />
            <p class="text-xs text-muted-foreground">
              This password will be needed to upload images to this folder
            </p>
          </div>
          
          {#if error}
            <div class="text-destructive text-sm">{error}</div>
          {/if}
          
          <Button type="submit" class="w-full" disabled={isCreating}>
            {#if isCreating}
              Creating...
            {:else}
              Create Folder
            {/if}
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>