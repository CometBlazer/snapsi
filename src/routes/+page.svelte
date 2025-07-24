<!-- src/routes/+page.svelte (Fixed layout and price input) -->
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
    description: "Find the perfect domain name with smart suggestions and intelligent ranking"
  }
  const jsonldScript = `<script type="application/ld+json">${
    JSON.stringify(ldJson) + "<"
  }/script>`

  // Form state
  let searchQuery = '';
  let inputType: 'idea' | 'exact_name' | 'base_name' = 'idea';
  let field = '';
  let style: 'short' | 'brandable' | 'keyword' | 'creative' | 'professional' = 'brandable';
  let domainPreference = 'any';
  let providerPreference: 'name.com' | 'porkbun' | 'any' = 'name.com';
  let maxPrice = 200;
  let numChoices = 10;
  let additionalDomains = '';

  // UI state
  let isLoading = false;
  let searchResults: DomainResult[] = [];
  let error = '';
  let searchSummary: any = null;
  let showAdvanced = false;
  let showJsonOutput = false;
  let fullApiResponse: any = null;

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
    fullApiResponse = null;
    showJsonOutput = false;

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
      fullApiResponse = response; // Store the full response for JSON display
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

  function copyJsonToClipboard() {
    if (fullApiResponse) {
      navigator.clipboard.writeText(JSON.stringify(fullApiResponse, null, 2))
        .then(() => {
          // You could add a toast notification here
          console.log('JSON copied to clipboard');
        })
        .catch(err => {
          console.error('Failed to copy JSON: ', err);
        });
    }
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
    'any', '.com', '.io', '.ai', '.app', '.dev', '.net', '.org', '.co', 
    '.tech', '.online', '.site', '.store', '.shop'
  ];
</script>

<svelte:head>
  <title>{WebsiteName} | Find Perfect Domain Names with API</title>
  <meta name="description" content="Find the perfect domain name with smart suggestions, intelligent ranking, and real-time availability checking. Free domain search tool." />
  <meta name="keywords" content="domain finder, domain search, AI domain suggestions, domain availability, domain names" />
  <meta property="og:title" content="Domain Finder AI | Find Perfect Domain Names" />
  <meta property="og:description" content="Find the perfect domain name with smart suggestions and intelligent ranking" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={WebsiteBaseUrl} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Domain Finder AI | Find Perfect Domain Names" />
  <meta name="twitter:description" content="Find the perfect domain name with smart suggestions and intelligent ranking" />
  {@html jsonldScript}
</svelte:head>

<div class="container mx-auto py-12 px-4">
  <!-- Hero Section -->
  <div class="text-center max-w-5xl mx-auto mb-16">
    <h1 class="text-4xl md:text-6xl font-bold text-base-content mb-6">
      Find the <span class="text-primary font-extrabold">Perfect Domain</span> 
      with <span class="text-secondary font-extrabold">API</span>
    </h1>
    <p class="text-xl text-base-content/70 mb-8">
      Get intelligent domain suggestions with name ranking, real-time availability, and competitive pricing
    </p>
    
    <div class="flex flex-wrap gap-2 justify-center">
      <div class="badge badge-primary">API-First for Agentic Workflows</div>
      <div class="badge badge-secondary">Real-time Availability</div>
      <div class="badge badge-accent">Smart Ranking</div>
      <div class="badge badge-neutral">Multi-Provider</div>
    </div>
  </div>

  <!-- Search Form - Centered and Full Width -->
  <div class="max-w-7xl mx-auto mb-8">
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body p-8">
        <form on:submit|preventDefault={handleSearch} class="space-y-8">
          <!-- Main Search Input - Centered -->
          <div class="form-control max-w-5xl mx-auto text-center">
            <label class="label justify-center" for="search-input">
              <span class="label-text text-2xl font-semibold">What are you looking for?</span>
            </label>
            <div class="join w-full my-3">
              <input 
                id="search-input"
                type="text" 
                bind:value={searchQuery}
                placeholder="e.g., 'AI startup platform' or 'mycompany' or 'google.com'"
                class="input input-bordered input-lg join-item flex-1" 
                disabled={isLoading}
              />
              <button 
                type="submit" 
                class="btn btn-primary btn-lg join-item"
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
            <label class="label justify-center" for="search-input">
              <span class="label-text-alt">
                Auto-detected as: <span class="font-semibold capitalize">{inputType.replace('_', ' ')}</span>
              </span>
            </label>
          </div>

          <!-- Input Type Selection -->
          <div class="form-control max-w-5xl mx-auto mt-10">
            <fieldset>
              <legend class="label justify-center">
                <span class="label-text font-semibold">Search Type</span>
              </legend>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </fieldset>
          </div>

          <!-- Quick Settings -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div class="form-control">
              <label class="label" for="tld-preference">
                <span class="label-text">TLD Preference</span>
              </label>
              <select id="tld-preference" bind:value={domainPreference} class="select select-bordered">
                {#each tldOptions as tld}
                  <option value={tld}>{tld}</option>
                {/each}
              </select>
            </div>

            <div class="form-control">
              <label class="label" for="max-price">
                <span class="label-text">Max Price</span>
              </label>
              <label class="input input-bordered flex items-center gap-2">
                <span>$</span>
                <input 
                  id="max-price"
                  type="number" 
                  bind:value={maxPrice}
                  min="1" 
                  max="1000000" 
                  class="grow"
                />
              </label>
            </div>

            <div class="form-control">
              <label class="label" for="num-choices">
                <span class="label-text">Max Results</span>
              </label>
              <input 
                id="num-choices"
                type="number" 
                bind:value={numChoices}
                min="1" 
                max="20" 
                class="input input-bordered"
              />
            </div>
          </div>

          <!-- Advanced Options Toggle -->
          <div class="divider max-w-5xl mx-auto">
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
            <div class="space-y-6 pt-6 max-w-5xl mx-auto">
              <!-- Style Selection for AI Generation -->
              {#if inputType === 'idea'}
                <div class="form-control">
                  <fieldset>
                    <legend class="label">
                      <span class="label-text font-semibold">Generation Style</span>
                    </legend>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  </fieldset>
                </div>

                <div class="form-control">
                  <label class="label" for="field-input">
                    <span class="label-text">Industry/Field (optional)</span>
                  </label>
                  <input 
                    id="field-input"
                    type="text" 
                    bind:value={field}
                    placeholder="e.g., technology, healthcare, e-commerce"
                    class="input input-bordered"
                  />
                </div>
              {/if}

              <div class="form-control">
                <!-- svelte-ignore a11y_label_has_associated_control -->
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
                <!-- svelte-ignore a11y_label_has_associated_control -->
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
  </div>

  <!-- Error Display -->
  {#if error}
    <div class="alert alert-error max-w-5xl mx-auto mb-8">
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
              • Providers: {searchSummary.providers_used.join(', ')}
            </div>
          </div>
        </div>
      {/if}

      <!-- Results Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
            </div>
          </div>
        {/each}
      </div>

      <!-- API Response Section -->
      {#if fullApiResponse}
        <div class="card bg-base-100 shadow-lg border border-base-300 mb-8">
          <div class="card-body">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold flex items-center gap-2">
                <Icon icon="lucide:code" class="h-5 w-5" />
                API Response
              </h3>
              <div class="flex gap-2">
                <button 
                  class="btn btn-sm btn-outline"
                  on:click={copyJsonToClipboard}
                >
                  <Icon icon="lucide:copy" class="h-4 w-4 mr-1" />
                  Copy JSON
                </button>
                <button 
                  class="btn btn-sm btn-ghost"
                  on:click={() => showJsonOutput = !showJsonOutput}
                >
                  <Icon icon={showJsonOutput ? 'lucide:chevron-up' : 'lucide:chevron-down'} class="h-4 w-4 mr-1" />
                  {showJsonOutput ? 'Hide' : 'Show'} JSON
                </button>
              </div>
            </div>
            
            {#if showJsonOutput}
              <div class="mockup-code bg-base-200 text-sm max-h-96 overflow-y-auto">
                <pre class="px-4 py-2"><code>{JSON.stringify(fullApiResponse, null, 2)}</code></pre>
              </div>
            {:else}
              <div class="text-base-content/60 text-center py-8">
                Click "Show JSON" to view the complete API response
              </div>
            {/if}
          </div>
        </div>
      {/if}
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
            <h3 class="text-xl font-bold mb-2">Smart Suggestions</h3>
            <p class="text-base-content/70">
              Snapsi generates brandable, memorable domain names tailored to your business
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
              Snapsi scoring considers memorability, brandability, and keyword relevance
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
  {/if}
</div>

<div class="container mx-auto pt-24 px-4 max-w-5xl">
  <h2 class="text-3xl md:text-4xl font-bold text-base-content text-center mb-16">Frequently Asked Questions</h2>
  
  <div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
    <input type="checkbox" />
    <div class="collapse-title text-xl font-medium">
      Is this service really free? 
    </div>
    <div class="collapse-content">
      <p>Yes, our domain finder tool is completely <b>free to use</b>! We're currently in beta and focused on providing the best domain search experience. The API is also free during our development phase.</p>
    </div>
  </div> 

  <div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box mt-6">
    <input type="checkbox" />
    <div class="collapse-title text-xl font-medium">
      How accurate are the domain availability results?
    </div>
    <div class="collapse-content">
      <p>
        We provide <b>real-time availability checking</b> directly from registrar APIs (Name.com and Porkbun). Results are highly accurate, though we recommend double-checking before making a purchase as domain availability can change rapidly.
      </p>
    </div>
  </div> 

  <div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box mt-6">
    <input type="checkbox" />
    <div class="collapse-title text-xl font-medium">
      What makes your AI suggestions different from other domain tools?
    </div>
    <div class="collapse-content">
      <p>
        Our AI considers multiple factors including <b>brandability, memorability, length, keyword relevance, and TLD quality</b> to provide intelligent scoring from 0-10. We focus on generating creative, professional names rather than just keyword combinations.
      </p>
    </div>
  </div> 

  <div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box mt-6">
    <input type="checkbox" />
    <div class="collapse-title text-xl font-medium">
      Can I use your API for commercial projects?
    </div>
    <div class="collapse-content">
      <p>Yes! Our API is designed for <b>agentic workflows and commercial use</b>. Check out our comprehensive API documentation for integration details. We currently offer 100 requests per minute during our beta phase.</p>
    </div>
  </div>

  <div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box mt-6">
    <input type="checkbox" />
    <div class="collapse-title text-xl font-medium">
      Why do you recommend Name.com over Porkbun?
    </div>
    <div class="collapse-content">
      <p>Name.com offers <b>faster bulk checking</b> (up to 50 domains per request vs 1 domain every 10 seconds with Porkbun) and higher rate limits. Porkbun is better for individual domain checks and may have different pricing for some TLDs.</p>
    </div>
  </div>

  <div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box mt-6">
    <input type="checkbox" />
    <div class="collapse-title text-xl font-medium">
      What domain extensions (TLDs) do you support?
    </div>
    <div class="collapse-content">
      <p>We support <b>45+ domain extensions</b> including .com, .net, .org, .io, .ai, .app, .dev, .tech, .online, .store, .shop, and many more. Our AI ranking system considers TLD quality in the final scoring.</p>
    </div>
  </div>

  <div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box mt-6">
    <input type="checkbox" />
    <div class="collapse-title text-xl font-medium">
      How does the domain scoring system work?
    </div>
    <div class="collapse-content">
      <p>Our scoring algorithm weighs multiple factors: <b>source quality (30%), word quality (25%), length (20%), TLD quality (15%), keyword relevance (15%)</b>, plus memorability, brandability, and price factors. Scores range from 0-10, with 8+ being premium quality.</p>
    </div>
  </div>
</div>

<div class="container mx-auto pt-10 pb-24 px-4 max-w-5xl">
  <div class="mt-16 text-center card bg-primary/80 border-base-300 border-1 shadow-xl p-16 md:p-30 rounded-3xl">
    <h2 class="text-2xl md:text-4xl font-bold mb-12">Build your agentic workflow today with <span class="font-extrabold underline">{WebsiteName}</span>.</h2>
    <button class="btn btn-outline bg-base-100 btn-xl rounded-full gap-2 text-primary-content max-w-lg mx-auto" on:click={() => goto('/docs')}>
      <Icon icon="lucide:book" class="h-5 w-5" />
      View API Docs
    </button>
  </div>
</div>