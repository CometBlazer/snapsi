<script lang="ts">
    import { onMount } from 'svelte';
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { Label } from '$lib/components/ui/label';
    import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '$lib/components/ui/dialog';
    import { Share, Upload, Lock, Copy, Image as ImageIcon, RefreshCw } from 'lucide-svelte';
    import { Card, CardContent } from '$lib/components/ui/card';
    // import { toast } from '$lib/components/ui/toast';
    
    export let data;
    
    let password = '';
    let isAuthenticated = false;
    let isUploading = false;
    let uploadProgress = 0;
    let files: FileList | null = null;
    let shareUrl = '';
    let isRefreshing = false;
    
    $: folder = data.folder;
    $: images = data.images;
    
    onMount(() => {
      shareUrl = window.location.href;
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
          // toast({
          //   title: 'Error',
          //   description: 'Invalid password',
          //   variant: 'destructive'
          // });
        }
      } catch (error) {
        // toast({
        //   title: 'Error',
        //   description: 'Failed to verify password',
        //   variant: 'destructive'
        // });
      }
    }
    
    async function handleUpload() {
      if (!files || files.length === 0) {
        // toast({
        //   title: 'Error',
        //   description: 'Please select at least one file',
        //   variant: 'destructive'
        // });
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
            throw new Error('Failed to get upload URL');
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
        
        // toast({
        //   title: 'Success',
        //   description: 'Files uploaded successfully'
        // });
        
        // Refresh the image list
        await refreshImages();
      } catch (error) {
        // toast({
        //   title: 'Error',
        //   description: error instanceof Error ? error.message : 'An error occurred during upload',
        //   variant: 'destructive'
        // });
      } finally {
        isUploading = false;
        files = null;
      }
    }
    
    function copyShareUrl() {
      navigator.clipboard.writeText(shareUrl);
      // toast({
      //   title: 'Copied!',
      //   description: 'Share link copied to clipboard'
      // });
    }
    
    async function refreshImages() {
      isRefreshing = true;
      
      try {
        const response = await fetch(`/api/folders/${folder.id}/images`);
        if (response.ok) {
          const refreshedImages = await response.json();
          images = refreshedImages;
        }
      } catch (error) {
        // toast({
        //   title: 'Error',
        //   description: 'Failed to refresh images',
        //   variant: 'destructive'
        // });
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
          <p class="text-muted-foreground">Created: {new Date(folder.createdAt).toLocaleDateString()}</p>
        </div>
        
        <div class="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" on:click={refreshImages} disabled={isRefreshing}>
            <RefreshCw class="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Share class="h-4 w-4 mr-2" />
                Share
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share this folder</DialogTitle>
                <DialogDescription>
                  Anyone with this link can view and upload to this folder (with password)
                </DialogDescription>
              </DialogHeader>
              <div class="flex items-center gap-2 mt-2">
                <Input value={shareUrl} readonly />
                <Button variant="outline" size="icon" on:click={copyShareUrl}>
                  <Copy class="h-4 w-4" />
                </Button>
              </div>
              <DialogFooter>
                <Button variant="outline" on:click={copyShareUrl}>Copy Link</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {#if !isAuthenticated}
        <Card>
          <CardContent class="p-6">
            <div class="flex flex-col items-center gap-4 py-6">
              <Lock class="h-12 w-12 text-muted-foreground" />
              <h2 class="text-xl font-semibold">Authentication Required</h2>
              <p class="text-center text-muted-foreground">
                Enter the folder password to view and upload images
              </p>
              <div class="w-full max-w-sm flex gap-2">
                <Input type="password" bind:value={password} placeholder="Enter password" />
                <Button on:click={verifyPassword}>Unlock</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Image upload section -->
          <Card>
            <CardContent class="p-6">
              <div class="flex flex-col items-center gap-4">
                <Upload class="h-10 w-10 text-muted-foreground" />
                <h2 class="text-xl font-semibold">Upload Images</h2>
                
                <div class="w-full">
                  <Label for="files" class="block mb-2">Select Images</Label>
                  <Input 
                    id="files" 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    bind:files 
                    disabled={isUploading}
                  />
                </div>
                
                {#if isUploading}
                  <div class="w-full">
                    <div class="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        class="h-full bg-primary" 
                        style="width: {uploadProgress}%;"
                      ></div>
                    </div>
                    <p class="text-center text-sm text-muted-foreground mt-2">
                      Uploading... {Math.round(uploadProgress)}%
                    </p>
                  </div>
                {/if}
                
                <Button 
                  class="w-full" 
                  on:click={handleUpload} 
                  disabled={!files || files.length === 0 || isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <!-- Share information -->
          <Card>
            <CardContent class="p-6">
              <div class="flex flex-col items-center gap-4">
                <Share class="h-10 w-10 text-muted-foreground" />
                <h2 class="text-xl font-semibold">Share Instructions</h2>
                
                <div class="space-y-4 w-full">
                  <div>
                    <Label class="block mb-2">Share Link</Label>
                    <div class="flex gap-2">
                      <Input value={shareUrl} readonly />
                      <Button variant="outline" size="icon" on:click={copyShareUrl}>
                        <Copy class="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label class="block mb-2">Folder Password</Label>
                    <p class="text-sm text-muted-foreground">
                      Remember to share the password with people who need to upload images.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <!-- Image gallery -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold">Images ({images.length})</h2>
          </div>
          
          {#if images.length === 0}
            <div class="flex flex-col items-center justify-center py-10 text-center">
              <ImageIcon class="h-16 w-16 text-muted-foreground" />
              <h3 class="mt-4 text-lg font-medium">No images yet</h3>
              <p class="mt-1 text-muted-foreground">
                Upload images or share this folder with others to get started
              </p>
            </div>
          {:else}
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {#each images as image}
                <a href={image.url} target="_blank" rel="noopener noreferrer" class="group">
                  <div class="relative aspect-square rounded-lg overflow-hidden border bg-muted">
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