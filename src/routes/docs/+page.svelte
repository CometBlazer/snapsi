<!-- src/routes/docs/+page.svelte (Simple readable documentation) -->
<script lang="ts">
  import Icon from '@iconify/svelte';
  import { API_BASE_URL } from '$lib/api';
	import { WebsiteName } from '../../config';

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }
</script>

<svelte:head>
  <title>API Documentation | Domain Finder AI</title>
  <meta name="description" content="Complete API documentation for Domain Finder AI - endpoints, examples, and integration guide" />
</svelte:head>

<div class="container mx-auto py-8 px-4 max-w-4xl">
  <!-- Header -->
  <div class="text-center mb-12">
    <h1 class="text-4xl font-bold text-base-content mb-4">
      <span class="text-primary">{WebsiteName}</span> API Documentation
    </h1>
    <p class="text-xl text-base-content/70">
      Complete guide to integrating with our domain suggestion API
    </p>
    <div class="badge badge-success mt-4">Version 2.2.0</div>
  </div>

  <article class="prose prose-lg max-w-none">
    <!-- Overview -->
    <section class="mb-16">
      <h2 class="text-3xl font-bold mb-6 flex items-center gap-3">
        <Icon icon="lucide:info" class="h-8 w-8 text-primary" />
        Overview
      </h2>
      
      <!-- <div class="bg-base-200 p-6 rounded-lg mb-6">
        <h3 class="text-xl font-semibold mb-3">Base URL</h3>
        <div class="mockup-code">
          <pre data-prefix="$"><code>http://localhost:5173/api     # Development</code></pre>
          <pre data-prefix=">"><code>https://yourdomain.com/api   # Production</code></pre>
        </div>
        <p class="text-sm text-base-content/60 mt-2">All API routes are proxied through SvelteKit</p>
      </div> -->

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="bg-base-100 p-4 rounded-lg border">
          <h4 class="font-semibold mb-2">Authentication</h4>
          <p class="text-base-content/70">No authentication required during beta</p>
        </div>
        <div class="bg-base-100 p-4 rounded-lg border">
          <h4 class="font-semibold mb-2">Rate Limiting</h4>
          <p class="text-base-content/70">100 requests per minute per IP address</p>
        </div>
      </div>

      <!-- <h3 class="text-xl font-semibold mb-4">Key Features</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="flex items-center gap-2 p-3 bg-base-100 rounded-lg border">
          <Icon icon="lucide:brain" class="h-5 w-5 text-primary" />
          <span class="text-sm">AI-Powered</span>
        </div>
        <div class="flex items-center gap-2 p-3 bg-base-100 rounded-lg border">
          <Icon icon="lucide:trending-up" class="h-5 w-5 text-secondary" />
          <span class="text-sm">Smart Ranking</span>
        </div>
        <div class="flex items-center gap-2 p-3 bg-base-100 rounded-lg border">
          <Icon icon="lucide:zap" class="h-5 w-5 text-accent" />
          <span class="text-sm">Real-time</span>
        </div>
        <div class="flex items-center gap-2 p-3 bg-base-100 rounded-lg border">
          <Icon icon="lucide:shield" class="h-5 w-5 text-success" />
          <span class="text-sm">Rate Limited</span>
        </div>
      </div> -->
    </section>

    <!-- Quick Start -->
    <section class="mb-16">
      <h2 class="text-3xl font-bold mb-6 flex items-center gap-3">
        <Icon icon="lucide:rocket" class="h-8 w-8 text-primary" />
        Quick Start
      </h2>

      <div class="steps steps-vertical lg:steps-horizontal mb-8">
        <div class="step step-primary">Choose Use Case</div>
        <div class="step step-primary">Make Request</div>
        <div class="step step-primary">Handle Response</div>
        <div class="step">Integrate</div>
      </div>

      <h3 class="text-xl font-semibold mb-4">1. Choose Your Use Case</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="card bg-base-100 border">
          <div class="card-body p-4">
            <h4 class="font-semibold">Business Idea</h4>
            <p class="text-sm text-base-content/70">Generate suggestions from concept</p>
            <code class="text-xs">"ai startup platform"</code>
          </div>
        </div>
        <div class="card bg-base-100 border">
          <div class="card-body p-4">
            <h4 class="font-semibold">Base Name</h4>
            <p class="text-sm text-base-content/70">Check different TLDs</p>
            <code class="text-xs">"mycompany"</code>
          </div>
        </div>
        <div class="card bg-base-100 border">
          <div class="card-body p-4">
            <h4 class="font-semibold">Exact Domain</h4>
            <p class="text-sm text-base-content/70">Check specific domains</p>
            <code class="text-xs">"google.com"</code>
          </div>
        </div>
      </div>

      <h3 class="text-xl font-semibold mb-4">2. Make Your First Request</h3>
      <div class="mockup-code mb-4">
        <pre data-prefix="$"><code>curl -X POST "http://localhost:5173/api/domains/suggest" \</code></pre>
        <pre data-prefix=">"><code>  -H "Content-Type: application/json" \</code></pre>
        <pre data-prefix=">"><code>  -d '&#123;</code></pre>
        <pre data-prefix=">"><code>    "input_text": "ai startup platform",</code></pre>
        <pre data-prefix=">"><code>    "input_type": "idea",</code></pre>
        <pre data-prefix=">"><code>    "field": "technology",</code></pre>
        <pre data-prefix=">"><code>    "style": "brandable",</code></pre>
        <pre data-prefix=">"><code>    "num_choices": 5</code></pre>
        <pre data-prefix=">"><code>  &#125;'</code></pre>
      </div>

      <h3 class="text-xl font-semibold mb-4">3. Example Response</h3>
      <div class="mockup-code mb-6">
        <pre data-prefix="1"><code>&#123;</code></pre>
        <pre data-prefix="2"><code>  "domains": [</code></pre>
        <pre data-prefix="3"><code>    &#123;</code></pre>
        <pre data-prefix="4"><code>      "domain": "aiplatformhub.com",</code></pre>
        <pre data-prefix="5"><code>      "available": true,</code></pre>
        <pre data-prefix="6"><code>      "price_first_year": 12.99,</code></pre>
        <pre data-prefix="7"><code>      "price_annual": 14.99,</code></pre>
        <pre data-prefix="8"><code>      "score": 8.5,</code></pre>
        <pre data-prefix="9"><code>      "registrar": "name.com",</code></pre>
        <pre data-prefix="10"><code>      "input_source": "ai_generated",</code></pre>
        <pre data-prefix="11"><code>      "ranking_factors": &#123;</code></pre>
        <pre data-prefix="12"><code>        "word_quality": 6.5,</code></pre>
        <pre data-prefix="13"><code>        "tld_score": 10.0,</code></pre>
        <pre data-prefix="14"><code>        "length_score": 7.0</code></pre>
        <pre data-prefix="15"><code>      &#125;</code></pre>
        <pre data-prefix="16"><code>    &#125;</code></pre>
        <pre data-prefix="17"><code>  ],</code></pre>
        <pre data-prefix="18"><code>  "search_summary": &#123;</code></pre>
        <pre data-prefix="19"><code>    "available_domains_found": 8,</code></pre>
        <pre data-prefix="20"><code>    "input_type": "idea"</code></pre>
        <pre data-prefix="21"><code>  &#125;</code></pre>
        <pre data-prefix="22"><code>&#125;</code></pre>
      </div>
    </section>

    <!-- Main Endpoint -->
    <section class="mb-16">
      <h2 class="text-3xl font-bold mb-6 flex items-center gap-3">
        <Icon icon="lucide:globe" class="h-8 w-8 text-primary" />
        Main Endpoint
      </h2>

      <div class="bg-base-100 p-6 rounded-lg border mb-6">
        <div class="flex items-center gap-3 mb-4">
          <span class="badge badge-primary">POST</span>
          <code class="text-lg font-mono">/api/domains/suggest</code>
        </div>
        <p class="text-base-content/70 mb-4">Main endpoint for domain suggestions with intelligent ranking</p>
        
        <h4 class="font-semibold mb-3">Request Parameters</h4>
        <div class="overflow-x-auto mb-4">
          <table class="table table-zebra w-full">
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Type</th>
                <th>Required</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>input_text</code></td>
                <td>string</td>
                <td>✅</td>
                <td>Business idea, base name, or exact domain</td>
              </tr>
              <tr>
                <td><code>input_type</code></td>
                <td>string</td>
                <td>❌</td>
                <td>idea | exact_name | base_name</td>
              </tr>
              <tr>
                <td><code>field</code></td>
                <td>string</td>
                <td>❌</td>
                <td>Industry or field (optional)</td>
              </tr>
              <tr>
                <td><code>style</code></td>
                <td>string</td>
                <td>❌</td>
                <td>brandable | short | keyword | creative | professional</td>
              </tr>
              <tr>
                <td><code>domain_preference</code></td>
                <td>string</td>
                <td>❌</td>
                <td>.com | .io | .ai | any (default: .com)</td>
              </tr>
              <tr>
                <td><code>provider_preference</code></td>
                <td>string</td>
                <td>❌</td>
                <td>name.com | porkbun | any (default: name.com)</td>
              </tr>
              <tr>
                <td><code>max_price</code></td>
                <td>number</td>
                <td>❌</td>
                <td>Maximum price per year (default: 50)</td>
              </tr>
              <tr>
                <td><code>num_choices</code></td>
                <td>number</td>
                <td>❌</td>
                <td>Number of results 1-20 (default: 5)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4 class="font-semibold mb-3">Response Format</h4>
        <div class="mockup-code">
          <pre data-prefix="1"><code>&#123;</code></pre>
          <pre data-prefix="2"><code>  "domains": [</code></pre>
          <pre data-prefix="3"><code>    &#123;</code></pre>
          <pre data-prefix="4"><code>      "domain": "string",</code></pre>
          <pre data-prefix="5"><code>      "available": "boolean",</code></pre>
          <pre data-prefix="6"><code>      "price_first_year": "number | null",</code></pre>
          <pre data-prefix="7"><code>      "price_annual": "number | null",</code></pre>
          <pre data-prefix="8"><code>      "registrar": "string",</code></pre>
          <pre data-prefix="9"><code>      "deal_info": "string | null",</code></pre>
          <pre data-prefix="10"><code>      "score": "number (0-10)",</code></pre>
          <pre data-prefix="11"><code>      "input_source": "string",</code></pre>
          <pre data-prefix="12"><code>      "ranking_factors": "object"</code></pre>
          <pre data-prefix="13"><code>    &#125;</code></pre>
          <pre data-prefix="14"><code>  ],</code></pre>
          <pre data-prefix="15"><code>  "request_id": "string",</code></pre>
          <pre data-prefix="16"><code>  "timestamp": "string",</code></pre>
          <pre data-prefix="17"><code>  "search_summary": "object"</code></pre>
          <pre data-prefix="18"><code>&#125;</code></pre>
        </div>
      </div>
    </section>

    <!-- Other Endpoints -->
    <section class="mb-16">
      <h2 class="text-3xl font-bold mb-6 flex items-center gap-3">
        <Icon icon="lucide:list" class="h-8 w-8 text-primary" />
        Other Endpoints
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="card bg-base-100 border">
          <div class="card-body p-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="badge badge-success">GET</span>
              <code>/api/health</code>
            </div>
            <p class="text-sm text-base-content/70">API status and configuration</p>
            <div class="badge badge-outline badge-sm mt-2">Not rate limited</div>
          </div>
        </div>

        <div class="card bg-base-100 border">
          <div class="card-body p-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="badge badge-success">GET</span>
              <code>/api/rate-limit</code>
            </div>
            <p class="text-sm text-base-content/70">Current rate limit status</p>
            <div class="badge badge-outline badge-sm mt-2">Not rate limited</div>
          </div>
        </div>

        <div class="card bg-base-100 border">
          <div class="card-body p-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="badge badge-success">GET</span>
              <code>/api/pricing</code>
            </div>
            <p class="text-sm text-base-content/70">Pricing and provider information</p>
            <div class="badge badge-outline badge-sm mt-2">Not rate limited</div>
          </div>
        </div>

        <div class="card bg-base-100 border">
          <div class="card-body p-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="badge badge-success">GET</span>
              <code>/api/tlds</code>
            </div>
            <p class="text-sm text-base-content/70">Available domain extensions</p>
            <div class="badge badge-outline badge-sm mt-2">Not rate limited</div>
          </div>
        </div>

        <div class="card bg-base-100 border">
          <div class="card-body p-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="badge badge-success">GET</span>
              <code>/api/ranking</code>
            </div>
            <p class="text-sm text-base-content/70">Ranking algorithm details</p>
            <div class="badge badge-outline badge-sm mt-2">Not rate limited</div>
          </div>
        </div>

        <div class="card bg-base-100 border">
          <div class="card-body p-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="badge badge-primary">POST</span>
              <code>/api/parse-input</code>
            </div>
            <p class="text-sm text-base-content/70">Debug input parsing</p>
            <div class="badge badge-warning badge-sm mt-2">Rate limited</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Examples -->
    <section class="mb-16">
      <h2 class="text-3xl font-bold mb-6 flex items-center gap-3">
        <Icon icon="lucide:code" class="h-8 w-8 text-primary" />
        Examples
      </h2>

      <h3 class="text-xl font-semibold mb-4">Business Idea Generation</h3>
      <p class="mb-4">Generate AI suggestions based on business concept:</p>
      <div class="mockup-code mb-6">
        <pre data-prefix="$"><code>curl -X POST "http://localhost:5173/api/domains/suggest" \</code></pre>
        <pre data-prefix=">"><code>  -H "Content-Type: application/json" \</code></pre>
        <pre data-prefix=">"><code>  -d '&#123;</code></pre>
        <pre data-prefix=">"><code>    "input_text": "artificial intelligence customer service platform",</code></pre>
        <pre data-prefix=">"><code>    "input_type": "idea",</code></pre>
        <pre data-prefix=">"><code>    "field": "technology",</code></pre>
        <pre data-prefix=">"><code>    "style": "brandable",</code></pre>
        <pre data-prefix=">"><code>    "domain_preference": ".com",</code></pre>
        <pre data-prefix=">"><code>    "max_price": 50,</code></pre>
        <pre data-prefix=">"><code>    "num_choices": 5</code></pre>
        <pre data-prefix=">"><code>  &#125;'</code></pre>
      </div>

      <h3 class="text-xl font-semibold mb-4">Base Name Expansion</h3>
      <p class="mb-4">Check a base name with different TLDs:</p>A
      <div class="mockup-code mb-6">
        <pre data-prefix="$"><code>curl -X POST "http://localhost:5173/api/domains/suggest" \</code></pre>
        <pre data-prefix=">"><code>  -H "Content-Type: application/json" \</code></pre>
        <pre data-prefix=">"><code>  -d '&#123;</code></pre>
        <pre data-prefix=">"><code>    "input_text": "mycompany",</code></pre>
        <pre data-prefix=">"><code>    "input_type": "base_name",</code></pre>
        <pre data-prefix=">"><code>    "domain_preference": "any",</code></pre>
        <pre data-prefix=">"><code>    "num_choices": 10</code></pre>
        <pre data-prefix=">"><code>  &#125;'</code></pre>
      </div>

      <h3 class="text-xl font-semibold mb-4">Exact Domain Check</h3>
      <p class="mb-4">Check specific domain(s) for availability:</p>
      <div class="mockup-code mb-6">
        <pre data-prefix="$"><code>curl -X POST "http://localhost:5173/api/domains/suggest" \</code></pre>
        <pre data-prefix=">"><code>  -H "Content-Type: application/json" \</code></pre>
        <pre data-prefix=">"><code>  -d '&#123;</code></pre>
        <pre data-prefix=">"><code>    "input_text": "mycompany.com",</code></pre>
        <pre data-prefix=">"><code>    "input_type": "exact_name",</code></pre>
        <pre data-prefix=">"><code>    "additional_domains": ["mycompany.io", "mycompany.ai"],</code></pre>
        <pre data-prefix=">"><code>    "num_choices": 10</code></pre>
        <pre data-prefix=">"><code>  &#125;'</code></pre>
      </div>

      <!-- <h3 class="text-xl font-semibold mb-4">JavaScript Integration</h3>
      <div class="mockup-code mb-6">
        <pre data-prefix="1"><code>// JavaScript/TypeScript example</code></pre>
        <pre data-prefix="2"><code>async function searchDomains(query) &#123;</code></pre>
        <pre data-prefix="3"><code>  try &#123;</code></pre>
        <pre data-prefix="4"><code>    const response = await fetch('/api/domains/suggest', &#123;</code></pre>
        <pre data-prefix="5"><code>      method: 'POST',</code></pre>
        <pre data-prefix="6"><code>      headers: &#123; 'Content-Type': 'application/json' &#125;,</code></pre>
        <pre data-prefix="7"><code>      body: JSON.stringify(&#123;</code></pre>
        <pre data-prefix="8"><code>        input_text: query,</code></pre>
        <pre data-prefix="9"><code>        input_type: 'idea',</code></pre>
        <pre data-prefix="10"><code>        style: 'brandable',</code></pre>
        <pre data-prefix="11"><code>        num_choices: 10</code></pre>
        <pre data-prefix="12"><code>      &#125;)</code></pre>
        <pre data-prefix="13"><code>    &#125;);</code></pre>
        <pre data-prefix="14"><code></code></pre>
        <pre data-prefix="15"><code>    if (!response.ok) &#123;</code></pre>
        <pre data-prefix="16"><code>      throw new Error(`HTTP       <h3 class="text-xl font-semibold mb-4">JavaScript Integration</h3>
      <div class="mockup-code mb-6">
        <pre><code>// JavaScript/TypeScript example</code></pre>
        <pre><code>async function searchDomains(query) {</code></pre>
        <pre data-prefix="1"><code>  try {</code></pre>
        <pre><code>    const response = await fetch('/api/domains/suggest', {</code></pre>
        <pre><code>      method: 'POST',</code></pre>
        <pre><code>      headers: { 'Content-Type': 'application/json' },</code></pre>
        <pre><code>      body: JSON.stringify({</code></pre>
        <pre><code>        input_text: query,</code></pre>
        <pre><code>        input_type: 'idea',</code></pre>
        <pre><code>        style: 'brandable',</code></pre>
        <pre><code>        num_choices: 10</code></pre>
        <pre><code>      })</code></pre>
        <pre><code>    });</code></pre>
        <pre><code></code></pre>
        <pre><code>    if (!response.ok) {</code></pre>
        <pre><code>      throw new Error(`HTTP ${response.status}: ${response.statusText}`);</code></pre>
        <pre><code>    }</code></pre>
        <pre><code></code></pre>
        <pre><code>    const data = await response.json();</code></pre>
        <pre><code>    return data.domains;</code></pre>
        <pre><code>  } catch (error) {</code></pre>
        <pre><code>    console.error('Domain search failed:', error);</code></pre>
        <pre><code>    throw error;</code></pre>
        <pre><code>  }</code></pre>
        <pre><code>}</code></pre>
      </div>#123;response.status&#125;:       <h3 class="text-xl font-semibold mb-4">JavaScript Integration</h3>
      <div class="mockup-code mb-6">
        <pre><code>// JavaScript/TypeScript example</code></pre>
        <pre><code>async function searchDomains(query) {</code></pre>
        <pre><code>  try {</code></pre>
        <pre><code>    const response = await fetch('/api/domains/suggest', {</code></pre>
        <pre><code>      method: 'POST',</code></pre>
        <pre><code>      headers: { 'Content-Type': 'application/json' },</code></pre>
        <pre><code>      body: JSON.stringify({</code></pre>
        <pre><code>        input_text: query,</code></pre>
        <pre><code>        input_type: 'idea',</code></pre>
        <pre><code>        style: 'brandable',</code></pre>
        <pre><code>        num_choices: 10</code></pre>
        <pre><code>      })</code></pre>
        <pre><code>    });</code></pre>
        <pre><code></code></pre>
        <pre><code>    if (!response.ok) {</code></pre>
        <pre><code>      throw new Error(`HTTP ${response.status}: ${response.statusText}`);</code></pre>
        <pre><code>    }</code></pre>
        <pre><code></code></pre>
        <pre><code>    const data = await response.json();</code></pre>
        <pre><code>    return data.domains;</code></pre>
        <pre><code>  } catch (error) {</code></pre>
        <pre><code>    console.error('Domain search failed:', error);</code></pre>
        <pre><code>    throw error;</code></pre>
        <pre><code>  }</code></pre>
        <pre><code>}</code></pre>
      </div>#123;response.statusText&#125;`);</code></pre>
        <pre data-prefix="17"><code>    &#125;</code></pre>
        <pre data-prefix="18"><code></code></pre>
        <pre data-prefix="19"><code>    const data = await response.json();</code></pre>
        <pre data-prefix="20"><code>    return data.domains;</code></pre>
        <pre data-prefix="21"><code>  &#125; catch (error) &#123;</code></pre>
        <pre data-prefix="22"><code>    console.error('Domain search failed:', error);</code></pre>
        <pre data-prefix="23"><code>    throw error;</code></pre>
        <pre data-prefix="24"><code>  &#125;</code></pre>
        <pre data-prefix="25"><code>&#125;</code></pre>
      </div> -->
    </section>

    <!-- Domain Ranking -->
    <section class="mb-16">
      <h2 class="text-3xl font-bold mb-6 flex items-center gap-3">
        <Icon icon="lucide:trending-up" class="h-8 w-8 text-primary" />
        Our Domain Ranking System
      </h2>

      <div class="alert alert-info mb-6">
        <Icon icon="lucide:info" class="h-5 w-5" />
        <div>
          <!-- <div class="font-semibold">Intelligent domain ranking</div> -->
          <div class="text-sm">Score range: 0.0 to 10.0 (higher is better)</div>
        </div>
      </div>

      <h3 class="text-xl font-semibold mb-4">Ranking Factors</h3>
      <div class="overflow-x-auto mb-6">
        <table class="table table-zebra w-full">
          <thead>
            <tr>
              <th>Factor</th>
              <th>Weight</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Source Bonus</td>
              <td>30%</td>
              <td>User-provided (8.0) > Base expansion (6.0) > AI generated (4.0)</td>
            </tr>
            <tr>
              <td>Length Score</td>
              <td>20%</td>
              <td>Shorter domains score higher (≤5 chars = 8.0)</td>
            </tr>
            <tr>
              <td>Word Quality</td>
              <td>25%</td>
              <td>Real words vs gibberish, pronounceability</td>
            </tr>
            <tr>
              <td>TLD Quality</td>
              <td>15%</td>
              <td>.com (10.0) > .io (8.0) > .ai (7.5) > others</td>
            </tr>
            <tr>
              <td>Memorability</td>
              <td>10%</td>
              <td>Easy to remember and type</td>
            </tr>
            <tr>
              <td>Brandability</td>
              <td>10%</td>
              <td>Sounds like a professional brand</td>
            </tr>
            <tr>
              <td>Keyword Relevance</td>
              <td>15%</td>
              <td>Relevance to original search terms</td>
            </tr>
            <tr>
              <td>Price Factor</td>
              <td>5%</td>
              <td>Lower prices score higher</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-xl font-semibold mb-4">Quality Levels</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="flex items-center gap-3 p-4 bg-success/10 rounded-lg border border-success/20">
          <div class="w-3 h-3 rounded-full bg-success"></div>
          <div>
            <div class="font-semibold">Premium (8.0-10.0)</div>
            <div class="text-sm text-base-content/70">Exceptional domains</div>
          </div>
        </div>
        <div class="flex items-center gap-3 p-4 bg-info/10 rounded-lg border border-info/20">
          <div class="w-3 h-3 rounded-full bg-info"></div>
          <div>
            <div class="font-semibold">Strong (6.0-7.9)</div>
            <div class="text-sm text-base-content/70">Very good domains</div>
          </div>
        </div>
        <div class="flex items-center gap-3 p-4 bg-warning/10 rounded-lg border border-warning/20">
          <div class="w-3 h-3 rounded-full bg-warning"></div>
          <div>
            <div class="font-semibold">Good (4.0-5.9)</div>
            <div class="text-sm text-base-content/70">Solid domains</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Provider Information -->
    <section class="mb-16">
      <h2 class="text-3xl font-bold mb-6 flex items-center gap-3">
        <Icon icon="lucide:server" class="h-8 w-8 text-primary" />
        Provider Information
      </h2>

      <div class="alert alert-success mb-6">
        <Icon icon="lucide:gift" class="h-5 w-5" />
        <div>
          <div class="font-semibold">Open Beta - Free to Use!</div>
          <div class="text-sm">API is currently free during development phase</div>
        </div>
      </div>
      <div class="alert alert-info mb-6">
        <Icon icon="lucide:trending-up" class="h-5 w-5" />
        <div>
          <div class="font-semibold">Providers</div>
          <div class="text-sm">As of right now, the only providers are Name.com and Porkbun. Depending on demand, we may add more in the future. </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="card bg-base-100 border">
          <div class="card-body">
            <h3 class="card-title">
              Name.com
              <span class="badge badge-success">Recommended</span>
            </h3>
            <div class="space-y-2 text-sm">
              <div><strong>Rate Limit:</strong> 20 requests/sec, 3000/hour</div>
              <div><strong>Bulk Check:</strong> Up to 50 domains per call</div>
              <div><strong>Speed:</strong> Fast bulk checking</div>
              <div class="text-success">✅ Default choice - fast and reliable</div>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 border">
          <div class="card-body">
            <h3 class="card-title">
              Porkbun
              <span class="badge badge-warning">Limited</span>
            </h3>
            <div class="space-y-2 text-sm">
              <div><strong>Rate Limit:</strong> 1 domain per 10 seconds</div>
              <div><strong>Bulk Check:</strong> 1 domain at a time</div>
              <div><strong>Speed:</strong> Very slow</div>
              <div class="text-warning">⚠️ Only for individual domain checks</div>
            </div>
          </div>
        </div>
      </div>

      <h3 class="text-xl font-semibold mb-4 mt-8">Supported TLDs</h3>
      <p class="mb-4">45+ domain extensions available:</p>
      <div class="flex flex-wrap gap-2 mb-6">
        {#each ['.com', '.net', '.org', '.io', '.co', '.ai', '.app', '.dev', '.tech', '.online', '.site', '.store', '.shop', '.biz', '.info', '.me', '.cc', '.tv', '.xyz', '.cloud', '.digital', '.agency', '.studio', '.design', '.media'] as tld}
          <span class="badge badge-outline">{tld}</span>
        {/each}
        <span class="badge badge-ghost">+20 more</span>
      </div>
    </section>

    <!-- Error Handling -->
    <section class="mb-16">
      <h2 class="text-3xl font-bold mb-6 flex items-center gap-3">
        <Icon icon="lucide:alert-triangle" class="h-8 w-8 text-primary" />
        Error Handling
      </h2>

      <h3 class="text-xl font-semibold mb-4">HTTP Status Codes</h3>
      <div class="overflow-x-auto mb-6">
        <table class="table table-zebra w-full">
          <thead>
            <tr>
              <th>Code</th>
              <th>Description</th>
              <th>Meaning</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>200</code></td>
              <td>Success</td>
              <td>Request completed successfully</td>
            </tr>
            <tr>
              <td><code>400</code></td>
              <td>Bad Request</td>
              <td>Invalid input parameters</td>
            </tr>
            <tr>
              <td><code>422</code></td>
              <td>Validation Error</td>
              <td>Request body validation failed</td>
            </tr>
            <tr>
              <td><code>429</code></td>
              <td>Rate Limit Exceeded</td>
              <td>Too many requests (100/minute)</td>
            </tr>
            <tr>
              <td><code>500</code></td>
              <td>Internal Server Error</td>
              <td>API or provider error</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-xl font-semibold mb-4">Example Error Responses</h3>
      <div class="mockup-code mb-4">
        <pre data-prefix="1"><code>// Rate limit exceeded (429)</code></pre>
        <pre data-prefix="2"><code>&#123;</code></pre>
        <pre data-prefix="3"><code>  "detail": &#123;</code></pre>
        <pre data-prefix="4"><code>    "error": "Rate limit exceeded",</code></pre>
        <pre data-prefix="5"><code>    "message": "Maximum 100 requests per minute allowed",</code></pre>
        <pre data-prefix="6"><code>    "retry_after": 45</code></pre>
        <pre data-prefix="7"><code>  &#125;</code></pre>
        <pre data-prefix="8"><code>&#125;</code></pre>
      </div>

      <div class="mockup-code mb-6">
        <pre data-prefix="1"><code>// Validation error (422)</code></pre>
        <pre data-prefix="2"><code>&#123;</code></pre>
        <pre data-prefix="3"><code>  "detail": [</code></pre>
        <pre data-prefix="4"><code>    &#123;</code></pre>
        <pre data-prefix="5"><code>      "loc": ["body", "input_text"],</code></pre>
        <pre data-prefix="6"><code>      "msg": "Input text cannot be empty",</code></pre>
        <pre data-prefix="7"><code>      "type": "value_error"</code></pre>
        <pre data-prefix="8"><code>    &#125;</code></pre>
        <pre data-prefix="9"><code>  ]</code></pre>
        <pre data-prefix="10"><code>&#125;</code></pre>
      </div>
    </section>

    <!-- Best Practices -->
    <section class="mb-16">
      <h2 class="text-3xl font-bold mb-6 flex items-center gap-3">
        <Icon icon="lucide:check-circle" class="h-8 w-8 text-primary" />
        Best Practices
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-lg font-semibold mb-3 text-success">✅ Do</h3>
          <ul class="space-y-2">
            <li class="flex items-start gap-2">
              <Icon icon="lucide:check" class="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
              <span>Use name.com provider for fastest results</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon icon="lucide:check" class="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
              <span>Monitor rate limits with /api/rate-limit</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon icon="lucide:check" class="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
              <span>Cache results to avoid repeat requests</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon icon="lucide:check" class="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
              <span>Handle errors gracefully with try/catch</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon icon="lucide:check" class="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
              <span>Use specific field/industry for better AI results</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-3 text-error">❌ Don't</h3>
          <ul class="space-y-2">
            <li class="flex items-start gap-2">
              <Icon icon="lucide:x" class="h-4 w-4 text-error mt-0.5 flex-shrink-0" />
              <span>Use porkbun for bulk domain checking</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon icon="lucide:x" class="h-4 w-4 text-error mt-0.5 flex-shrink-0" />
              <span>Exceed rate limits - implement backoff</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon icon="lucide:x" class="h-4 w-4 text-error mt-0.5 flex-shrink-0" />
              <span>Ignore error responses or status codes</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon icon="lucide:x" class="h-4 w-4 text-error mt-0.5 flex-shrink-0" />
              <span>Make requests without timeout handling</span>
            </li>
            <li class="flex items-start gap-2">
              <Icon icon="lucide:x" class="h-4 w-4 text-error mt-0.5 flex-shrink-0" />
              <span>Request more domains than you need</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Support -->
    <section class="mb-16">
      <h2 class="text-3xl font-bold mb-6 flex items-center gap-3">
        <Icon icon="lucide:help-circle" class="h-8 w-8 text-primary" />
        Support & Resources
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card bg-base-100 border">
          <div class="card-body p-6 text-center">
            <Icon icon="lucide:heart-pulse" class="h-12 w-12 mx-auto mb-4 text-success" />
            <h3 class="font-semibold mb-2">API Status</h3>
            <p class="text-sm text-base-content/70 mb-3">Check real-time API health</p>
            <code class="text-xs bg-base-200 px-2 py-1 rounded">GET /api/health</code>
          </div>
        </div>

        <div class="card bg-base-100 border">
          <div class="card-body p-6 text-center">
            <Icon icon="lucide:gauge" class="h-12 w-12 mx-auto mb-4 text-info" />
            <h3 class="font-semibold mb-2">Rate Limits</h3>
            <p class="text-sm text-base-content/70 mb-3">Monitor your usage</p>
            <code class="text-xs bg-base-200 px-2 py-1 rounded">GET /api/rate-limit</code>
          </div>
        </div>

        <div class="card bg-base-100 border">
          <div class="card-body p-6 text-center">
            <Icon icon="lucide:book" class="h-12 w-12 mx-auto mb-4 text-warning" />
            <h3 class="font-semibold mb-2">Check Providers</h3>
            <p class="text-sm text-base-content/70 mb-3">Check all available providers</p>
            <code class="text-xs bg-base-200 px-2 py-1 rounded">GET /api/test-providers</code>
          </div>
        </div>
      </div>

      <div class="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
        <h3 class="text-lg font-semibold mb-3 flex items-center gap-2">
          <Icon icon="lucide:lightbulb" class="h-5 w-5 text-primary" />
          Quick Tips
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>For Startups:</strong> Use "brandable" style with your industry field for the best AI-generated suggestions that sound professional and memorable.
          </div>
          <div>
            <strong>For Existing Businesses:</strong> Use "base_name" input type with your company name to check availability across different TLDs.
          </div>
          <div>
            <strong>For Developers:</strong> The API auto-detects input type, but specifying it explicitly gives you more control over the search behavior.
          </div>
          <div>
            <strong>For High Volume:</strong> Use name.com provider exclusively and implement client-side caching to minimize API calls.
          </div>
        </div>
      </div>
    </section>
  </article>
</div>