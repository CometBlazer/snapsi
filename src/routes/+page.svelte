<script lang="ts">
  // src/routes/+page.svelte
  import { goto } from '$app/navigation';
  import Icon from '@iconify/svelte';
  import { onMount } from 'svelte';
	import { WebsiteBaseUrl, WebsiteDescription, WebsiteName } from '../config';

  const ldJson = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: WebsiteName,
    url: WebsiteBaseUrl,
  }
  const jsonldScript = `<script type="application/ld+json">${
    JSON.stringify(ldJson) + "<"
  }/script>`

  // Specify image dimensions and use WebP if available
  const heroImages = [
    {
      image1:
        "https://snappi-v1.imgix.net/8a0b7a67-ed8c-4d25-9cb8-b21168ea78b4/family-sunset_1746120391049.png",
      image2:
        "https://snappi-v1.imgix.net/8a0b7a67-ed8c-4d25-9cb8-b21168ea78b4/pexels-asadphoto-1024960_1746120380962.jpg",
      width: 400,
      height: 400,
    },
    {
      image1:
        "https://snappi-v1.imgix.net/cc558ef6-146a-430e-bdc5-9e34b0262cf4/dog%20(7)_1745634056493.jpg",
      image2:
        "https://snappi-v1.imgix.net/cc558ef6-146a-430e-bdc5-9e34b0262cf4/dog%20(10)_1745634058609.jpg",
      width: 400,
      height: 400,
    },
  ]

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

<svelte:head>
  <title>{WebsiteName} | Easy Photo Sharing</title>
  <meta name="description" content={WebsiteDescription} />
  <meta
    name="keywords"
    content="Free photo sharing, file sharing, {WebsiteName}"
  />
  <meta
    property="og:title"
    content="{WebsiteName} | Easy Photo Sharing"
  />
  <meta property="og:description" content={WebsiteDescription} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://snapsi.me" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta
    name="twitter:title"
    content="{WebsiteName} | Easy Photo Sharing"
  />
  <meta name="twitter:description" content={WebsiteDescription} />
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html jsonldScript}

  <!-- Preload critical hero images -->
  <link
    rel="preload"
    href={heroImages[0].image1}
    as="image"
    fetchpriority="high"
  />
  <link
    rel="preload"
    href={heroImages[0].image2}
    as="image"
    fetchpriority="high"
  />
  <link
    rel="preload"
    href={heroImages[1].image1}
    as="image"
    fetchpriority="high"
  />
  <link
    rel="preload"
    href={heroImages[1].image2}
    as="image"
    fetchpriority="high"
  />
</svelte:head>

<div class="container mx-auto py-24 px-4">
  <div class="flex flex-col items-center text-center max-w-3xl mx-auto">
    <h1 class="text-4xl md:text-5xl font-bold text-base-content">Share <span class="text-secondary font-extrabold">Large Amounts</span> of Photos <span class="text-secondary font-extrabold">Quickly</span>. Free.</h1>
    <p class="mt-6 text-xl text-base-content/70">
      Create <b>private, secure</b> folders to upload and share photos with anyone, protected by passwords.
    </p>

    <div class="my-16 flex flex-col sm:flex-row gap-4">
      <button class="btn btn-primary btn-xl rounded-full gap-2 text-primary-content" on:click={() => goto('/folder/create')}>
        <Icon icon="lucide:upload" class="h-5 w-5" />
        Upload Photos for Free
      </button>

      <button class="btn btn-outline btn-xl rounded-full gap-2 text-primary-content" on:click={openFolderDialog}>
        <Icon icon="lucide:eye" class="h-5 w-5" />
        View Folder Photos
      </button>
    </div>
  </div>
  <!-- Image Gallery -->
  <div class="relative w-full h-52 md:h-72 max-w-5xl mx-auto mt-12">
    <!-- First Person Images - Left Side -->
    <div
      class="absolute bottom-0 left-4 sm:left-8 md:left-12 h-52 md:h-72 w-44 md:w-60"
    >
      <img
        src={heroImages[0].image1}
        alt="Example 1"
        width={heroImages[0].width}
        height={heroImages[0].height}
        loading="eager"
        decoding="async"
        class="absolute w-20 sm:w-24 md:w-40 h-20 sm:h-24 md:h-40
         object-cover rounded-full shadow-lg
         bottom-24 md:bottom-36 left-0 z-20
         transition-transform hover:scale-105"
      />
      <img
        src={heroImages[0].image2}
        alt="Example 2"
        width={heroImages[0].width}
        height={heroImages[0].height}
        loading="eager"
        decoding="async"
        class="absolute w-28 sm:w-32 md:w-48 h-28 sm:h-32 md:h-48
         object-cover rounded-2xl shadow-lg
         bottom-0 left-10 md:left-20 z-10
         transition-transform hover:scale-105"
      />
      
      <!-- Floating Upload Icon 1 - Left Side Top -->
      <div class="absolute top-4 left-38 z-30 animate-bounce-slow">
        <div class="bg-primary text-primary-content p-2 rounded-full shadow-lg">
          <Icon icon="lucide:upload-cloud" class="h-10 w-10" />
        </div>
      </div>
      
      <!-- Floating Upload Icon 2 - Left Side Bottom -->
      <div class="absolute bottom-12 left-2 z-30 animate-pulse">
        <div class="bg-secondary text-secondary-content p-2 rounded-full shadow-lg">
          <Icon icon="lucide:image-plus" class="h-4 w-4" />
        </div>
      </div>
    </div>

    <!-- Second Person Images - Right Side -->
    <div
      class="absolute bottom-0 right-4 sm:right-8 md:right-12 h-52 md:h-72 w-44 md:w-60"
    >
      <img
        src={heroImages[1].image1}
        alt="Example 3"
        width={heroImages[1].width}
        height={heroImages[1].height}
        loading="eager"
        decoding="async"
        class="absolute w-20 sm:w-24 md:w-40 h-20 sm:h-24 md:h-40
         object-cover rounded-2xl shadow-lg
         bottom-24 md:bottom-36 right-0 z-20
         transition-transform hover:scale-105"
      />
      <img
        src={heroImages[1].image2}
        alt="Example 4"
        width={heroImages[1].width}
        height={heroImages[1].height}
        loading="eager"
        decoding="async"
        class="absolute w-28 sm:w-32 md:w-48 h-28 sm:h-32 md:h-48
         object-cover object-top rounded-full shadow-lg
         bottom-0 right-12 md:right-28 z-10
         transition-transform hover:scale-105"
      />
      
      <!-- Floating Upload Icon 3 - Right Side Top -->
      <div class="absolute top-0 right-35 z-30 animate-bounce-slow">
        <div class="bg-accent text-accent-content p-2 rounded-full shadow-lg">
          <Icon icon="lucide:camera" class="h-10 w-10" />
        </div>
      </div>
      
      <!-- Floating Upload Icon 4 - Right Side Bottom -->
      <div class="absolute bottom-10 right-2 z-30 animate-bounce-slow">
        <div class="bg-primary text-primary-content p-3 rounded-full shadow-lg">
          <Icon icon="lucide:file-image" class="h-8 w-8" />
        </div>
      </div>
    </div>
    
    <!-- Central Floating Icons -->
    <div class="absolute top-0 left-1/2 transform -translate-x-1/2 z-30 animate-float">
      <div class="bg-secondary/80 text-secondary-content p-3 rounded-full shadow-lg">
        <Icon icon="lucide:upload" class="h-6 w-6" />
      </div>
    </div>
    
    <!-- Additional Floating Small Icons -->
    <div class="absolute top-10 left-1/3 z-30 animate-pulse-slow">
      <div class="bg-primary/70 text-primary-content p-1.5 rounded-full shadow-lg">
        <Icon icon="lucide:image" class="h-4 w-4" />
      </div>
    </div>
    
    <div class="absolute top-6 right-1/3 z-30 animate-bounce-slow">
      <div class="bg-accent/70 text-accent-content p-1.5 rounded-full shadow-lg">
        <Icon icon="lucide:folder-plus" class="h-10 w-10" />
      </div>
    </div>
  </div>
</div>

<div class="container mx-auto py-10 sm:py-16 px-4 max-w-5xl">
  <h2 class="text-3xl md:text-4xl font-bold text-base-content text-center mt-12 mb-16">It's Easy as <span class="text-secondary font-extrabold">1, 2, 3</span>. <span class="underline">No Sign-In</span> Required.</h2>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full">
    <div class="card bg-base-100 border-base-300 border-1 shadow-xl">
      <div class="card-body items-center text-center py-20">
        <div class="rounded-full bg-primary/10 p-4 mb-6">
          <Icon icon="lucide:folder-plus" class="h-10 w-10 text-primary" />
        </div>
        <h2 class="card-title text-base-content">1. Create Folder.</h2>
        <p class="text-base-content/70">
          Enter a folder name and create a private folder to organize your photos.
        </p>
      </div>
    </div>
    
    <div class="card bg-base-100 border-base-300 border-1 shadow-xl">
      <div class="card-body items-center text-center py-20">
        <div class="rounded-full bg-primary/10 p-4 mb-6">
          <Icon icon="lucide:upload" class="h-10 w-10 text-primary" />
        </div>
        <h2 class="card-title text-base-content">2. Upload photos.</h2>
        <p class="text-base-content/70">
          Securely upload photos to your folder without compression or quality loss. 
        </p>
      </div>
    </div>
    
    <div class="card bg-base-100 border-base-300 border-1 shadow-xl">
      <div class="card-body items-center text-center py-20">
        <div class="rounded-full bg-primary/10 p-4 mb-6">
          <Icon icon="lucide:image" class="h-10 w-10 text-primary" />
        </div>
        <h2 class="card-title text-base-content">3. Share Securely!</h2>
        <p class="text-base-content/70">
          Share your unique folder link with optional password protection.
        </p>
      </div>
    </div>
  </div>
</div>

<div class="container mx-auto pt-24 px-4 max-w-5xl">
  <h2 class="text-3xl md:text-4xl font-bold text-base-content text-center mb-16">Frequently Asked Questions</h2>
  <div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
    <input type="checkbox" />
    <div class="collapse-title text-xl font-medium">
      Is this secure? 
    </div>
    <div class="collapse-content">
      <p>Yes, we take the security of your photos seriously. All images are securely uploaded to a private Google Cloud Storage bucket, and all image retreivals are through signed URLs that expire after 24 hours. Your images are <b>private to YOU</b> and never shared with any third parties. You can also delete your images at any time.</p>
    </div>
  </div> 

  <div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box mt-6">
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

  <div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box mt-6">
    <input type="checkbox" />
    <div class="collapse-title text-xl font-medium">
      Is this service really free? 
    </div>
    <div class="collapse-content">
      <p>
        Yes, this service is completely <b>free to use</b>! We are currently in beta and will be adding more features in the future. 
      </p>
    </div>
  </div> 

  <div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box mt-6">
    <input type="checkbox" />
    <div class="collapse-title text-xl font-medium">
      How do I share my folder?
    </div>
    <div class="collapse-content">
      <p>You can share your folder by copying the share link and optionally protecting it with a password. Remember, your link is private and should only be shared with people you trust.</p>
    </div>
  </div>

  <div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box mt-6">
    <input type="checkbox" />
    <div class="collapse-title text-xl font-medium">
      What are limits on the number of photos I can upload and the size of each photo?
    </div>
    <div class="collapse-content">
      <p>Each folder has a limit of 100 photos, and each photo can be up to 500 MB in size.</p>
    </div>
  </div>

  <div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box mt-6">
    <input type="checkbox" />
    <div class="collapse-title text-xl font-medium">
      I want to delete my photos, how do I do that?
    </div>
    <div class="collapse-content">
      <p>You can delete your photos at any time by selecting the photos you want to delete and clicking "Delete Selected".</p>
    </div>
  </div>
</div>

<div class="container mx-auto pt-10 pb-24 px-4 max-w-5xl">
  <div class="mt-16 text-center card bg-primary/80 border-base-300 border-1 shadow-xl p-16 md:p-30 rounded-3xl">
    <h2 class="text-2xl md:text-4xl font-bold mb-12">Share your photos quickly and securely today with <span class="font-extrabold underline">Snappi</span>.</h2>
    <button class="btn btn-outline bg-base-100 btn-xl rounded-full gap-2 text-primary-content max-w-lg mx-auto" on:click={() => goto('/folder/create')}>
      <Icon icon="lucide:sparkles" class="h-5 w-5" />
      Try It Free Now
    </button>
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

<style>
  /* Add these animation styles to your global CSS or in this component */
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-15px);
    }
  }
  
  @keyframes pulse-slow {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.8;
    }
  }
  
  @keyframes bounce-slow {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-8px);
    }
  }
  
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  
  .animate-pulse-slow {
    animation: pulse-slow 5s ease-in-out infinite;
  }
  
  .animate-bounce-slow {
    animation: bounce-slow 4s ease-in-out infinite;
  }
</style>