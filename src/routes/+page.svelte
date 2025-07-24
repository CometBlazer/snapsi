<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { goto } from '$app/navigation';
  import Icon from '@iconify/svelte';
  import { onMount } from 'svelte';
  import { WebsiteBaseUrl, WebsiteDescription, WebsiteName } from '../config';
  import { domainAPI, type DomainRequest, type DomainResult } from '$lib/api';

  // SEO and meta data
  const ldJson = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Domain Finder AI",
    url: WebsiteBaseUrl,
    description: "Find the perfect domain name with AI-powered suggestions and intelligent ranking"
  }
  const jsonldScript = `<script type="application/ld+json">${
    JSON.stringify(ldJson) + "<"
  }/script>`

  // Form state
  let searchQuery = '';
  let inputType: 'idea' | 'exact_name' | 'base_name' = 'idea';
  let field = '';
  let style: 'short' | 'brandable' | 'keyword' | 'creative' | 'professional' = 'brandable';
  let domainPreference = '.com';
  let providerPreference: 'name.com' | 'porkbun' | 'any' = 'name.com';
  let maxPrice = 50;
  let numChoices = 10;
  let additionalDomains = '';

  // UI state
  let isLoading = false;
  let searchResults: DomainResult[] = [];
  let error = '';
  let searchSummary: any = null;
  let showAdvanced = false;

  // Auto-detect input type
  $: {
    if (searchQuery.trim()) {
      if (searchQuery.includes('.') && /\.(com|net|org|io|ai|app|dev)$/i.test(searchQuery)) {
        inputType = 'exact_name';
      } else if (searchQuery.split(' ').length === 1 && searchQuery.length <= 20) {
        inputType = 'base_name';
      } else {
        inputType = 'idea';
      }
    }
  }

  async function handleSearch() {
    if (!searchQuery.trim()) {
      error = 'Please enter a search term';
      return;
    }

    isLoading = true;
    error = '';
    searchResults = [];
    searchSummary = null;

    try {
      const request: DomainRequest = {
        input_text: searchQuery.trim(),
        input_type: inputType,
        field: field.trim(),
        style,
        domain_preference: domainPreference === 'any' ? 'any' : domainPreference,
        provider_preference: providerPreference,
        max_price: maxPrice,
        num_choices: numChoices,
        additional_domains: additionalDomains.split(',').map(d => d.trim()).filter(Boolean)
      };

      const response = await domainAPI.suggestDomains(request);
      searchResults = response.domains;
      searchSummary = response.search_summary;
    } catch (err) {
      error = err instanceof Error ? err.message : 'An error occurred';
    } finally {
      isLoading = false;
    }
  }

  function getScoreColor(score: number): string {
    if (score >= 8) return 'text-success';
    if (score >= 6) return 'text-info';
    if (score >= 4) return 'text-warning';
    return 'text-error';
  }

  function getScoreLabel(score: number): string {
    if (score >= 8) return 'Premium';
    if (score >= 6) return 'Strong';
    if (score >= 4) return 'Good';
    if (score >= 2) return 'Fair';
    return 'Poor';
  }

  const inputTypeOptions = [
    { value: 'idea', label: 'Business Idea', description: 'Generate suggestions from your concept' },
    { value: 'base_name', label: 'Base Name', description: 'Check different TLDs for a name' },
    { value: 'exact_name', label: 'Exact Domain', description: 'Check specific domain(s)' }
  ];

  const styleOptions = [
    { value: 'brandable', label: 'Brandable', description: 'Modern, memorable names' },
    { value: 'short', label: 'Short', description: 'Concise, 4-6 characters' },
    { value: 'keyword', label: 'Keyword', description: 'Industry-relevant terms' },
    { value: 'creative', label: 'Creative', description: 'Unique variations' },
    { value: 'professional', label: 'Professional', description: 'Business-focused' }
  ];

  const tldOptions = [
    '.com', '.io', '.ai', '.app', '.dev', '.net', '.org', '.co', 
    '.tech', '.online', '.site', '.store', '.shop', 'any'
  ];
</script>

<svelte:head>
  <title>Domain Finder AI | Find Perfect Domain Names with AI</title>
  <meta name="description" content="Find the perfect domain name with AI-powered suggestions, intelligent ranking, and real-time availability checking. Free domain search tool." />
  <meta name="keywords" content="domain finder, domain search, AI domain suggestions, domain availability, domain names" />
  <meta property="og:title" content="Domain Finder AI | Find Perfect Domain Names" />
  <meta property="og:description" content="Find the perfect domain name with AI-powered suggestions and intelligent ranking" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={WebsiteBaseUrl} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Domain Finder AI | Find Perfect Domain Names" />
  <meta name="twitter:description" content="Find the perfect domain name with AI-powered suggestions and intelligent ranking" />
  {@html jsonldScript}
</svelte:head>

<div class="container mx-auto py-12 px-4">
  <!-- Hero Section -->
  <div class="text-center max-w-4xl mx-auto mb-16">
    <h1 class="text-4xl md:text-6xl font-bold text-base-content mb-6">
      Find the <span class="text-primary font-extrabold">Perfect Domain</span> 
      with <span class="text-secondary font-extrabold">AI</span>
    </h1>
    <p class="text-xl text-base-content/70 mb-8">
      Get intelligent domain suggestions with GoDaddy-style ranking, real-time availability, and competitive pricing
    </p>
    
    <div class="flex flex-wrap gap-2 justify-center">
      <div class="badge badge-primary">AI-Powered</div>
      <div class="badge badge-secondary">Real-time Availability</div>
      <div class="badge badge-accent">Smart Ranking</div>
      <div class="badge badge-neutral">Multi-Provider</div>
    </div>
  </div>

  <!-- Search Form -->
  <div class="card bg-base-100 shadow-xl max-w-4xl mx-auto mb-8">
    <div class="card-body p-8">
      <form on:submit|preventDefault={handleSearch} class="space-y-6">
        <!-- Main Search Input -->
        <div class="form-control">
          <label class="label">
            <span class="label-text text-lg font-semibold">What are you looking for?</span>
          </label>
          <div class="input-group">
            <input 
              type="text" 
              bind:value={searchQuery}
              placeholder="e.g., 'AI startup platform' or 'mycompany' or 'google.com'"
              class="input input-bordered input-lg flex-1" 
              disabled={isLoading}
            />
            <button 
              type="submit" 
              class="btn btn-primary btn-lg"
              class:loading={isLoading}
              disabled={isLoading || !searchQuery.trim()}
            >
              {#if isLoading}
                <Icon icon="lucide:loader-2" class="h-5 w-5 animate-spin" />
              {:else}
                <Icon icon="lucide:search" class="h-5 w-5" />
              {/if}
              Search
            </button>
          </div>
          <label class="label">
            <span class="label-text-alt">
              Auto-detected as: <span class="font-semibold capitalize">{inputType.replace('_', ' ')}</span>
            </span>
          </label>
        </div>

        <!-- Input Type Selection -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Search Type</span>
          </label>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
            {#each inputTypeOptions as option}
              <label class="label cursor-pointer justify-start">
                <input 
                  type="radio" 
                  name="inputType" 
                  value={option.value}
                  bind:group={inputType}
                  class="radio radio-primary mr-3" 
                />
                <div>
                  <div class="font-medium">{option.label}</div>
                  <div class="text-sm text-base-content/60">{option.description}</div>
                </div>
              </label>
            {/each}
          </div>
        </div>

        <!-- Quick Settings -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">TLD Preference</span>
            </label>
            <select bind:value={domainPreference} class="select select-bordered">
              {#each tldOptions as tld}
                <option value={tld}>{tld}</option>
              {/each}
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Max Price</span>
            </label>
            <div class="input-group">
              <span class="bg-base-200 px-3 py-2 border border-base-300 rounded-l-lg">$</span>
              <input 
                type="number" 
                bind:value={maxPrice}
                min="1" 
                max="1000" 
                class="input input-bordered flex-1 rounded-l-none"
              />
            </div>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Results</span>
            </label>
            <input 
              type="number" 
              bind:value={numChoices}
              min="1" 
              max="20" 
              class="input input-bordered"
            />
          </div>
        </div>

        <!-- Advanced Options Toggle -->
        <div class="divider">
          <button 
            type="button"
            class="btn btn-ghost btn-sm"
            on:click={() => showAdvanced = !showAdvanced}
          >
            <Icon icon={showAdvanced ? 'lucide:chevron-up' : 'lucide:chevron-down'} class="h-4 w-4 mr-2" />
            Advanced Options
          </button>
        </div>

        {#if showAdvanced}
          <div class="space-y-4 border-t pt-6">
            <!-- Style Selection for AI Generation -->
            {#if inputType === 'idea'}
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold">Generation Style</span>
                </label>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {#each styleOptions as option}
                    <label class="label cursor-pointer justify-start">
                      <input 
                        type="radio" 
                        name="style" 
                        value={option.value}
                        bind:group={style}
                        class="radio radio-secondary mr-3" 
                      />
                      <div>
                        <div class="font-medium">{option.label}</div>
                        <div class="text-sm text-base-content/60">{option.description}</div>
                      </div>
                    </label>
                  {/each}
                </div>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text">Industry/Field (optional)</span>
                </label>
                <input 
                  type="text" 
                  bind:value={field}
                  placeholder="e.g., technology, healthcare, e-commerce"
                  class="input input-bordered"
                />
              </div>
            {/if}

            <div class="form-control">
              <label class="label">
                <span class="label-text">Provider</span>
              </label>
              <select bind:value={providerPreference} class="select select-bordered">
                <option value="name.com">Name.com (Fast, Recommended)</option>
                <option value="porkbun">Porkbun (Slow, Different Pricing)</option>
                <option value="any">All Providers (Best Coverage)</option>
              </select>
            </div>

            {#if inputType === 'exact_name'}
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Additional Domains (comma-separated)</span>
                </label>
                <textarea 
                  bind:value={additionalDomains}
                  placeholder="example.io, mycompany.ai, startup.dev"
                  class="textarea textarea-bordered"
                  rows="2"
                ></textarea>
              </div>
            {/if}
          </div>
        {/if}
      </form>
    </div>
  </div>

  <!-- Error Display -->
  {#if error}
    <div class="alert alert-error max-w-4xl mx-auto mb-8">
      <Icon icon="lucide:alert-circle" class="h-5 w-5" />
      <span>{error}</span>
    </div>
  {/if}

  <!-- Loading State -->
  {#if isLoading}
    <div class="flex justify-center items-center py-16">
      <div class="flex flex-col items-center gap-4">
        <div class="loading loading-spinner loading-lg text-primary"></div>
        <p class="text-lg">Searching for domains...</p>
      </div>
    </div>
  {/if}

  <!-- Search Results -->
  {#if searchResults.length > 0}
    <div class="max-w-6xl mx-auto">
      <!-- Search Summary -->
      {#if searchSummary}
        <div class="alert alert-info mb-6">
          <Icon icon="lucide:info" class="h-5 w-5" />
          <div>
            <div class="font-semibold">Search Complete</div>
            <div class="text-sm">
              Found {searchSummary.available_domains_found} available domains 
              from {searchSummary.domains_actually_checked_by_providers} checked
              • Method: {searchSummary.generation_method.type.replace('_', ' ')}
              • Providers: {searchSummary.providers_used.join(', ')}
            </div>
          </div>
        </div>
      {/if}

      <!-- Results Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {#each searchResults as domain, index}
          <div class="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-shadow">
            <div class="card-body p-6">
              <!-- Domain Header -->
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="badge badge-lg {getScoreColor(domain.score)} badge-outline">
                    #{index + 1}
                  </div>
                  <h3 class="text-xl font-bold text-base-content">{domain.domain}</h3>
                </div>
                <div class="text-right">
                  <div class="text-2xl font-bold {getScoreColor(domain.score)}">
                    {domain.score.toFixed(1)}
                  </div>
                  <div class="text-sm text-base-content/60">
                    {getScoreLabel(domain.score)}
                  </div>
                </div>
              </div>

              <!-- Pricing Info -->
              {#if domain.price_first_year}
                <div class="flex items-center justify-between mb-4 p-3 bg-base-200 rounded-lg">
                  <div>
                    <div class="font-semibold text-lg">
                      ${domain.price_first_year.toFixed(2)}/first year
                    </div>
                    {#if domain.price_annual && domain.price_annual !== domain.price_first_year}
                      <div class="text-sm text-base-content/60">
                        Then ${domain.price_annual.toFixed(2)}/year
                      </div>
                    {/if}
                  </div>
                  <div class="badge badge-ghost">{domain.registrar}</div>
                </div>
              {/if}

              <!-- Deal Info -->
              {#if domain.deal_info}
                <div class="text-sm text-base-content/70 mb-4 p-2 bg-warning/10 rounded border-l-4 border-warning">
                  <Icon icon="lucide:tag" class="h-4 w-4 inline mr-1" />
                  {domain.deal_info}
                </div>
              {/if}

              <!-- Ranking Factors -->
              {#if domain.ranking_factors && showAdvanced}
                <div class="collapse collapse-arrow border border-base-300 bg-base-100/50">
                  <input type="checkbox" />
                  <div class="collapse-title text-sm font-medium">
                    Ranking Details
                  </div>
                  <div class="collapse-content text-xs space-y-1">
                    {#each Object.entries(domain.ranking_factors) as [key, value]}
                      {#if typeof value === 'number'}
                        <div class="flex justify-between">
                          <span class="capitalize">{key.replace('_', ' ')}:</span>
                          <span class="font-mono">{value.toFixed(1)}</span>
                        </div>
                      {/if}
                    {/each}
                  </div>
                </div>
              {/if}

              <!-- Source Badge -->
              <div class="flex justify-between items-center mt-4">
                <div class="badge badge-outline capitalize">
                  {domain.input_source.replace('_', ' ')}
                </div>
                <button class="btn btn-primary btn-sm">
                  <Icon icon="lucide:external-link" class="h-4 w-4 mr-1" />
                  Register
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Empty State -->
  {#if !isLoading && searchResults.length === 0 && !error && searchQuery}
    <div class="text-center py-16">
      <Icon icon="lucide:search-x" class="h-16 w-16 mx-auto text-base-content/30 mb-4" />
      <h3 class="text-xl font-semibold mb-2">No available domains found</h3>
      <p class="text-base-content/60">Try adjusting your search terms or increasing the max price</p>
    </div>
  {/if}

  <!-- Features Section -->
  {#if !searchQuery}
    <div class="max-w-6xl mx-auto mt-16">
      <h2 class="text-3xl font-bold text-center mb-12">
        Why Choose Our <span class="text-primary">Domain Finder</span>?
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="card bg-base-100 shadow-lg">
          <div class="card-body text-center">
            <div class="rounded-full bg-primary/10 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Icon icon="lucide:brain" class="h-8 w-8 text-primary" />
            </div>
            <h3 class="text-xl font-bold mb-2">AI-Powered Suggestions</h3>
            <p class="text-base-content/70">
              Advanced algorithms generate brandable, memorable domain names tailored to your business
            </p>
          </div>
        </div>

        <div class="card bg-base-100 shadow-lg">
          <div class="card-body text-center">
            <div class="rounded-full bg-secondary/10 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Icon icon="lucide:trending-up" class="h-8 w-8 text-secondary" />
            </div>
            <h3 class="text-xl font-bold mb-2">Intelligent Ranking</h3>
            <p class="text-base-content/70">
              GoDaddy-style scoring considers memorability, brandability, and keyword relevance
            </p>
          </div>
        </div>

        <div class="card bg-base-100 shadow-lg">
          <div class="card-body text-center">
            <div class="rounded-full bg-accent/10 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Icon icon="lucide:zap" class="h-8 w-8 text-accent" />
            </div>
            <h3 class="text-xl font-bold mb-2">Real-time Availability</h3>
            <p class="text-base-content/70">
              Instant availability checking across multiple registrars with live pricing
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="text-center mt-16 p-8 bg-primary/5 rounded-2xl max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold mb-4">Ready to find your perfect domain?</h2>
      <p class="text-base-content/70 mb-6">
        Start by entering your business idea, company name, or exact domain above
      </p>
      <div class="flex justify-center gap-4">
        <button class="btn btn-outline" on:click={() => goto('/docs')}>
          <Icon icon="lucide:book" class="h-4 w-4 mr-2" />
          View API Docs
        </button>
      </div>
    </div>
  {/if}
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