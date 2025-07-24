<!-- src/routes/docs/+page.svelte (Fixed syntax error) -->
<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import { domainAPI, API_BASE_URL } from '$lib/api';

  interface ExampleData {
    description?: string;
    example_request?: any;
    expected_suggestions?: string[];
    will_check?: string[];
  }

  interface RankingDetails {
    weight: string;
    description: string;
    scores?: Record<string, any>;
    factors?: string[];
  }

  interface ProviderDetails {
    rate_limit: string;
    bulk_check: string;
    pricing: string;
    recommended?: string;
  }

  let apiHealth: any = null;
  let examples: Record<string, ExampleData> = {};
  let pricing: any = null;
  let ranking: any = null;
  let tlds: any = null;
  let rateLimit: any = null;
  
  let loading = true;
  let activeTab = 'overview';

  onMount(async () => {
    try {
      const [healthRes, examplesRes, pricingRes, rankingRes, tldsRes, rateLimitRes] = await Promise.all([
        domainAPI.getHealth(),
        domainAPI.getExamples(),
        domainAPI.getPricing(),
        domainAPI.getRanking(),
        domainAPI.getTLDs(),
        domainAPI.getRateLimit()
      ]);

      apiHealth = healthRes;
      examples = examplesRes;
      pricing = pricingRes;
      ranking = rankingRes;
      tlds = tldsRes;
      rateLimit = rateLimitRes;
    } catch (error) {
      console.error('Failed to load API documentation:', error);
    } finally {
      loading = false;
    }
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'lucide:home' },
    { id: 'quickstart', label: 'Quick Start', icon: 'lucide:rocket' },
    { id: 'endpoints', label: 'Endpoints', icon: 'lucide:globe' },
    { id: 'examples', label: 'Examples', icon: 'lucide:code' },
    { id: 'ranking', label: 'Ranking', icon: 'lucide:trending-up' },
    { id: 'pricing', label: 'Pricing', icon: 'lucide:credit-card' }
  ];

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }
</script>

<svelte:head>
  <title>API Documentation | Domain Finder AI</title>
  <meta name="description" content="Complete API documentation for Domain Finder AI - endpoints, examples, and integration guide" />
</svelte:head>

<div class="container mx-auto py-8 px-4">
  <!-- Header -->
  <div class="text-center mb-12">
    <h1 class="text-4xl font-bold text-base-content mb-4">
      <span class="text-primary">Domain Finder</span> API Documentation
    </h1>
    <p class="text-xl text-base-content/70 max-w-3xl mx-auto">
      Complete guide to integrating with our AI-powered domain suggestion API
    </p>
    
    {#if apiHealth}
      <div class="flex justify-center items-center gap-4 mt-6">
        <div class="badge badge-success gap-2">
          <Icon icon="lucide:check-circle" class="h-4 w-4" />
          API Status: {apiHealth.status}
        </div>
        <div class="badge badge-info">Version: {apiHealth.version}</div>
        {#if rateLimit}
          <div class="badge badge-warning">
            Rate Limit: {rateLimit.rate_limit.remaining}/{rateLimit.rate_limit.max_requests} remaining
          </div>
        {/if}
      </div>
    {/if}
  </div>

  <div class="max-w-7xl mx-auto">
    <!-- Tab Navigation -->
    <div class="tabs tabs-boxed mb-8 flex-wrap justify-center">
      {#each tabs as tab}
        <button 
          class="tab gap-2"
          class:tab-active={activeTab === tab.id}
          on:click={() => activeTab = tab.id}
        >
          <Icon icon={tab.icon} class="h-4 w-4" />
          {tab.label}
        </button>
      {/each}
    </div>

    {#if loading}
      <div class="flex justify-center py-16">
        <div class="loading loading-spinner loading-lg"></div>
      </div>
    {:else}

      <!-- Overview Tab -->
      {#if activeTab === 'overview'}
        <div class="space-y-8">
          <div class="card bg-base-100 shadow-lg">
            <div class="card-body">
              <h2 class="card-title text-2xl mb-4">
                <Icon icon="lucide:info" class="h-6 w-6" />
                API Overview
              </h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 class="text-lg font-bold mb-2">Base URL</h3>
                  <div class="mockup-code">
                    <pre><code>{API_BASE_URL}</code></pre>
                  </div>
                </div>
                
                <div>
                  <h3 class="text-lg font-bold mb-2">Authentication</h3>
                  <p class="text-base-content/70">No authentication required during beta</p>
                </div>
              </div>

              <div class="mt-6">
                <h3 class="text-lg font-bold mb-4">Key Features</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div class="flex items-center gap-2">
                    <Icon icon="lucide:brain" class="h-5 w-5 text-primary" />
                    <span>AI-Powered Suggestions</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <Icon icon="lucide:trending-up" class="h-5 w-5 text-secondary" />
                    <span>Intelligent Ranking</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <Icon icon="lucide:zap" class="h-5 w-5 text-accent" />
                    <span>Real-time Availability</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <Icon icon="lucide:shield" class="h-5 w-5 text-success" />
                    <span>Rate Limited</span>
                  </div>
                </div>
              </div>

              {#if rateLimit}
                <div class="mt-6">
                  <h3 class="text-lg font-bold mb-2">Rate Limiting</h3>
                  <div class="alert alert-info">
                    <Icon icon="lucide:clock" class="h-5 w-5" />
                    <div>
                      <div class="font-semibold">{rateLimit.rate_limit.max_requests} requests per minute</div>
                      <div class="text-sm">Currently: {rateLimit.rate_limit.used} used, {rateLimit.rate_limit.remaining} remaining</div>
                    </div>
                  </div>
                </div>
              {/if}
            </div>
          </div>
        </div>
      {/if}

      <!-- Quick Start Tab -->
      {#if activeTab === 'quickstart'}
        <div class="space-y-8">
          <div class="card bg-base-100 shadow-lg">
            <div class="card-body">
              <h2 class="card-title text-2xl mb-6">
                <Icon icon="lucide:rocket" class="h-6 w-6" />
                Quick Start Guide
              </h2>

              <div class="steps steps-vertical">
                <div class="step step-primary">
                  <div class="step-content">
                    <h3 class="text-lg font-bold mb-2">1. Choose Your Use Case</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div class="card bg-base-200">
                        <div class="card-body p-4">
                          <h4 class="font-semibold">Business Idea</h4>
                          <p class="text-sm text-base-content/70">Generate suggestions from concept</p>
                        </div>
                      </div>
                      <div class="card bg-base-200">
                        <div class="card-body p-4">
                          <h4 class="font-semibold">Base Name</h4>
                          <p class="text-sm text-base-content/70">Check different TLDs</p>
                        </div>
                      </div>
                      <div class="card bg-base-200">
                        <div class="card-body p-4">
                          <h4 class="font-semibold">Exact Domain</h4>
                          <p class="text-sm text-base-content/70">Check specific domains</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="step step-primary">
                  <div class="step-content">
                    <h3 class="text-lg font-bold mb-2">2. Make Your First Request</h3>
                    <div class="mockup-code">
                      <pre><code>curl -X POST "{API_BASE_URL}/api/domains/suggest" \
  -H "Content-Type: application/json" \
  -d '{JSON.stringify({"input_text": "ai startup platform", "input_type": "idea", "field": "technology", "style": "brandable", "num_choices": 5})}'</code></pre>
                    </div>
                    <button 
                      class="btn btn-sm btn-outline mt-2"
                      on:click={() => copyToClipboard(`curl -X POST "${API_BASE_URL}/api/domains/suggest" -H "Content-Type: application/json" -d '{"input_text": "ai startup platform", "input_type": "idea", "field": "technology", "style": "brandable", "num_choices": 5}'`)}
                    >
                      <Icon icon="lucide:copy" class="h-4 w-4 mr-1" />
                      Copy
                    </button>
                  </div>
                </div>

                <div class="step step-primary">
                  <div class="step-content">
                    <h3 class="text-lg font-bold mb-2">3. Understand the Response</h3>
                    <div class="mockup-code">
                      <pre><code>{JSON.stringify({
                        domains: [{
                          domain: "aiplatformhub.com",
                          available: true,
                          price_first_year: 12.99,
                          score: 8.5,
                          registrar: "name.com",
                          ranking_factors: {
                            word_quality: 6.5,
                            tld_score: 10.0,
                            length_score: 7.0
                          }
                        }],
                        search_summary: {
                          available_domains_found: 8,
                          input_type: "idea"
                        }
                      }, null, 2)}</code></pre>
                    </div>
                  </div>
                </div>

                <div class="step step-primary">
                  <div class="step-content">
                    <h3 class="text-lg font-bold mb-2">4. Integrate with Your App</h3>
                    <div class="tabs tabs-boxed mb-4">
                      <button class="tab tab-active">JavaScript</button>
                      <button class="tab">Python</button>
                      <button class="tab">cURL</button>
                    </div>
                    <div class="mockup-code">
                      <pre><code>{`// JavaScript/TypeScript
async function searchDomains(query) {
  const response = await fetch('${API_BASE_URL}/api/domains/suggest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input_text: query,
      input_type: 'idea',
      num_choices: 10
    })
  });
  
  return response.json();
}`}</code></pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/if}

      <!-- Endpoints Tab -->
      {#if activeTab === 'endpoints'}
        <div class="space-y-6">
          <!-- Main Endpoint -->
          <div class="card bg-base-100 shadow-lg">
            <div class="card-body">
              <h2 class="card-title text-xl">
                <span class="badge badge-primary">POST</span>
                /api/domains/suggest
              </h2>
              <p class="text-base-content/70 mb-4">Main endpoint for domain suggestions with intelligent ranking</p>
              
              <div class="tabs tabs-bordered">
                <input type="radio" name="suggest-tabs" id="suggest-request" class="tab" checked />
                <label for="suggest-request" class="tab">Request</label>
                <div class="tab-content">
                  <div class="mockup-code mt-4">
                    <pre><code>{JSON.stringify({
                      input_text: "string (required)",
                      input_type: "idea | exact_name | base_name",
                      field: "string (optional)",
                      style: "brandable | short | keyword | creative | professional",
                      domain_preference: ".com | .io | .ai | any",
                      provider_preference: "name.com | porkbun | any",
                      max_price: "number (default: 50)",
                      num_choices: "number (1-20, default: 5)"
                    }, null, 2)}</code></pre>
                  </div>
                </div>

                <input type="radio" name="suggest-tabs" id="suggest-response" class="tab" />
                <label for="suggest-response" class="tab">Response</label>
                <div class="tab-content">
                  <div class="mockup-code mt-4">
                    <pre><code>{JSON.stringify({
                      domains: [{
                        domain: "example.com",
                        available: true,
                        price_first_year: 12.99,
                        price_annual: 14.99,
                        registrar: "name.com",
                        score: 8.5,
                        input_source: "ai_generated",
                        ranking_factors: {}
                      }],
                      request_id: "uuid",
                      timestamp: "2024-01-15T10:30:00Z",
                      search_summary: {}
                    }, null, 2)}</code></pre>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Info Endpoints -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="card bg-base-100 shadow-lg">
              <div class="card-body">
                <h3 class="card-title">
                  <span class="badge badge-success">GET</span>
                  /api/health
                </h3>
                <p class="text-sm text-base-content/70">API status and configuration</p>
                <div class="badge badge-outline">Not rate limited</div>
              </div>
            </div>

            <div class="card bg-base-100 shadow-lg">
              <div class="card-body">
                <h3 class="card-title">
                  <span class="badge badge-success">GET</span>
                  /api/rate-limit
                </h3>
                <p class="text-sm text-base-content/70">Current rate limit status</p>
                <div class="badge badge-outline">Not rate limited</div>
              </div>
            </div>

            <div class="card bg-base-100 shadow-lg">
              <div class="card-body">
                <h3 class="card-title">
                  <span class="badge badge-success">GET</span>
                  /api/pricing
                </h3>
                <p class="text-sm text-base-content/70">Pricing and provider info</p>
                <div class="badge badge-outline">Not rate limited</div>
              </div>
            </div>

            <div class="card bg-base-100 shadow-lg">
              <div class="card-body">
                <h3 class="card-title">
                  <span class="badge badge-success">GET</span>
                  /api/tlds
                </h3>
                <p class="text-sm text-base-content/70">Available domain extensions</p>
                <div class="badge badge-outline">Not rate limited</div>
              </div>
            </div>
          </div>
        </div>
      {/if}

      <!-- Examples Tab -->
      {#if activeTab === 'examples' && examples}
        <div class="space-y-6">
          {#each Object.entries(examples) as [key, example]}
            <div class="card bg-base-100 shadow-lg">
              <div class="card-body">
                <h3 class="card-title capitalize mb-4">
                  <Icon icon="lucide:code" class="h-5 w-5" />
                  {key.replace('_', ' ')}
                </h3>
                
                {#if example.description}
                  <p class="text-base-content/70 mb-4">{example.description}</p>
                {/if}

                {#if example.example_request}
                  <div class="tabs tabs-bordered">
                    <input type="radio" name="{key}-tabs" id="{key}-request" class="tab" checked />
                    <label for="{key}-request" class="tab">Request</label>
                    <div class="tab-content">
                      <div class="mockup-code mt-4">
                        <pre><code>{JSON.stringify(example.example_request, null, 2)}</code></pre>
                      </div>
                      <button 
                        class="btn btn-sm btn-outline mt-2"
                        on:click={() => copyToClipboard(JSON.stringify(example.example_request, null, 2))}
                      >
                        <Icon icon="lucide:copy" class="h-4 w-4 mr-1" />
                        Copy JSON
                      </button>
                    </div>

                    <input type="radio" name="{key}-tabs" id="{key}-curl" class="tab" />
                    <label for="{key}-curl" class="tab">cURL</label>
                    <div class="tab-content">
                      <div class="mockup-code mt-4">
                        <pre><code>curl -X POST "{API_BASE_URL}/api/domains/suggest" \
  -H "Content-Type: application/json" \
  -d '{JSON.stringify(example.example_request)}'</code></pre>
                      </div>
                      <button 
                        class="btn btn-sm btn-outline mt-2"
                        on:click={() => copyToClipboard(`curl -X POST "${API_BASE_URL}/api/domains/suggest" -H "Content-Type: application/json" -d '${JSON.stringify(example.example_request)}'`)}
                      >
                        <Icon icon="lucide:copy" class="h-4 w-4 mr-1" />
                        Copy cURL
                      </button>
                    </div>
                  </div>
                {/if}

                {#if example.expected_suggestions}
                  <div class="mt-4">
                    <h4 class="font-semibold mb-2">Expected Results:</h4>
                    <div class="flex flex-wrap gap-2">
                      {#each example.expected_suggestions as suggestion}
                        <span class="badge badge-outline">{suggestion}</span>
                      {/each}
                    </div>
                  </div>
                {/if}

                {#if example.will_check}
                  <div class="mt-4">
                    <h4 class="font-semibold mb-2">Will Check:</h4>
                    <div class="flex flex-wrap gap-2">
                      {#each example.will_check as domain}
                        <span class="badge badge-outline">{domain}</span>
                      {/each}
                    </div>
                  </div>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      {/if}

      <!-- Ranking Tab -->
      {#if activeTab === 'ranking' && ranking}
        <div class="space-y-6">
          <div class="card bg-base-100 shadow-lg">
            <div class="card-body">
              <h2 class="card-title text-2xl mb-4">
                <Icon icon="lucide:trending-up" class="h-6 w-6" />
                Domain Ranking System
              </h2>
              
              <div class="alert alert-info mb-6">
                <Icon icon="lucide:info" class="h-5 w-5" />
                <div>
                  <div class="font-semibold">{ranking.ranking_system}</div>
                  <div class="text-sm">Score range: {ranking.total_score_range}</div>
                </div>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {#each Object.entries(ranking.ranking_factors) as [factor, details]}
                  <div class="card bg-base-200">
                    <div class="card-body p-4">
                      <h3 class="card-title text-lg capitalize">
                        {factor.replace('_', ' ')}
                        <span class="badge badge-primary">{(details as RankingDetails).weight}</span>
                      </h3>
                      <p class="text-sm text-base-content/70 mb-3">{(details as RankingDetails).description}</p>
                      
                      {#if (details as RankingDetails).scores}
                        <div class="space-y-1">
                          {#each Object.entries((details as RankingDetails).scores || {}) as [key, value]}
                            <div class="flex justify-between text-sm">
                              <span>{key}:</span>
                              <span class="font-mono">{value}</span>
                            </div>
                          {/each}
                        </div>
                      {/if}

                      {#if (details as RankingDetails).factors}
                        <ul class="text-sm space-y-1">
                          {#each (details as RankingDetails).factors || [] as factorItem}
                            <li class="flex items-start gap-2">
                              <Icon icon="lucide:check" class="h-3 w-3 mt-0.5 text-success flex-shrink-0" />
                              {factorItem}
                            </li>
                          {/each}
                        </ul>
                      {/if}
                    </div>
                  </div>
                {/each}
              </div>

              <div class="mt-8">
                <h3 class="text-lg font-bold mb-4">Quality Indicators</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {#each Object.entries(ranking.quality_indicators) as [level, description]}
                    <div class="flex items-center gap-3 p-3 rounded-lg bg-base-200">
                      <div class="w-3 h-3 rounded-full bg-{level === 'excellent' ? 'success' : level === 'very_good' ? 'info' : level === 'good' ? 'warning' : level === 'fair' ? 'orange-500' : 'error'}"></div>
                      <div>
                        <div class="font-semibold capitalize">{level.replace('_', ' ')}</div>
                        <div class="text-sm text-base-content/70">{description}</div>
                      </div>
                    </div>
                  {/each}
                </div>
              </div>
            </div>
          </div>
        </div>
      {/if}

      <!-- Pricing Tab -->
      {#if activeTab === 'pricing' && pricing}
        <div class="space-y-6">
          <div class="card bg-base-100 shadow-lg">
            <div class="card-body">
              <h2 class="card-title text-2xl mb-4">
                <Icon icon="lucide:credit-card" class="h-6 w-6" />
                API Pricing & Limits
              </h2>

              <div class="alert alert-success mb-6">
                <Icon icon="lucide:gift" class="h-5 w-5" />
                <div>
                  <div class="font-semibold">{pricing.status.replace('_', ' ').toUpperCase()}</div>
                  <div class="text-sm">{pricing.message}</div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                {#each Object.entries(pricing.providers) as [provider, details]}
                  <div class="card bg-base-200">
                    <div class="card-body">
                      <h3 class="card-title capitalize mb-2">
                        {provider}
                        {#if (details as ProviderDetails).recommended?.includes('✅')}
                          <span class="badge badge-success">Recommended</span>
                        {:else if (details as ProviderDetails).recommended?.includes('⚠️')}
                          <span class="badge badge-warning">Limited</span>
                        {/if}
                      </h3>
                      
                      <div class="space-y-2 text-sm">
                        <div><strong>Rate Limit:</strong> {(details as ProviderDetails).rate_limit}</div>
                        <div><strong>Bulk Check:</strong> {(details as ProviderDetails).bulk_check}</div>
                        <div><strong>Pricing:</strong> {(details as ProviderDetails).pricing}</div>
                        {#if (details as ProviderDetails).recommended}
                          <div class="text-base-content/70">{(details as ProviderDetails).recommended}</div>
                        {/if}
                      </div>
                    </div>
                  </div>
                {/each}
              </div>

              {#if tlds}
                <div class="mt-8">
                  <h3 class="text-lg font-bold mb-4">
                    Supported TLDs ({tlds.total_tlds} available)
                  </h3>
                  <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {#each tlds.tlds.slice(0, 24) as tld}
                      <span class="badge badge-outline">{tld}</span>
                    {/each}
                    {#if tlds.tlds.length > 24}
                      <span class="badge badge-ghost">+{tlds.tlds.length - 24} more</span>
                    {/if}
                  </div>
                </div>
              {/if}
            </div>
          </div>
        </div>
      {/if}

    {/if}
  </div>
</div>