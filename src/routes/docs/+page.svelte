<!-- src/routes/docs/+page.svelte (Simple readable documentation) -->
<script lang="ts">
  import Icon from '@iconify/svelte';
  import { API_BASE_URL } from '$lib/api';

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
      <span class="text-primary">Domain Finder AI</span> API Documentation
    </h1>
    <p class="text-xl text-base-content/70">
      Complete guide to integrating with our AI-powered domain suggestion API
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
      
      <div class="bg-base-200 p-6 rounded-lg mb-6">
        <h3 class="text-xl font-semibold mb-3">Base URL</h3>
        <div class="mockup-code">
          <pre><code>http://localhost:5173/api     # Development
https://yourdomain.com/api   # Production</code></pre>
        </div>
        <p class="text-sm text-base-content/60 mt-2">All API routes are proxied through SvelteKit</p>
      </div>

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

      <h3 class="text-xl font-semibold mb-4">Key Features</h3>
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
      </div>
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
        <pre><code>curl -X POST "http://localhost:5173/api/domains/suggest" \
  -H "Content-Type: application/json" \
  -d '&#123;
    "input_text": "ai startup platform",
    "input_type": "idea",
    "field": "technology",
    "style": "brandable",
    "num_choices": 5
  &#125;'</code></pre>
      </div>

      <h3 class="text-xl font-semibold mb-4">3. Example Response</h3>
      <div class="mockup-code mb-6">
        <pre><code>{JSON.stringify({
          domains: [{
            domain: "aiplatformhub.com",
            available: true,
            price_first_year: 12.99,
            price_annual: 14.99,
            score: 8.5,
            registrar: "name.com",
            input_source: "ai_generated",
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
          <pre><code>{JSON.stringify({
            domains: [{
              domain: "string",
              available: "boolean",
              price_first_year: "number | null",
              price_annual: "number | null", 
              registrar: "string",
              deal_info: "string | null",
              score: "number (0-10)",
              input_source: "string",
              ranking_factors: "object"
            }],
            request_id: "string",
            timestamp: "string",
            search_summary: "object"
          }, null, 2)}</code></pre>
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
        <pre><code>curl -X POST "http://localhost:5173/api/domains/suggest" \
  -H "Content-Type: application/json" \
  -d '&#123;
    "input_text": "artificial intelligence customer service platform",
    "input_type": "idea",
    "field": "technology",
    "style": "brandable",
    "domain_preference": ".com",
    "max_price": 50,
    "num_choices": 5
  &#125;'</code></pre>
      </div>

      <h3 class="text-xl font-semibold mb-4">Base Name Expansion</h3>
      <p class="mb-4">Check a base name with different TLDs:</p>
      <div class="mockup-code mb-6">
        <pre><code>curl -X POST "http://localhost:5173/api/domains/suggest" \
  -H "Content-Type: application/json" \
  -d '&#123;
    "input_text": "mycompany",
    "input_type": "base_name",
    "domain_preference": "any",
    "num_choices": 10
  &#125;'</code></pre>
      </div>

      <h3 class="text-xl font-semibold mb-4">Exact Domain Check</h3>
      <p class="mb-4">Check specific domain(s) for availability:</p>
      <div class="mockup-code mb-6">
        <pre><code>curl -X POST "http://localhost:5173/api/domains/suggest" \
  -H "Content-Type: application/json" \
  -d '&#123;
    "input_text": "mycompany.com",
    "input_type": "exact_name",
    "additional_domains": ["mycompany.io", "mycompany.ai"],
    "num_choices": 10
  &#125;'</code></pre>
      </div>

      <h3 class="text-xl font-semibold mb-4">JavaScript Integration</h3>
      <div class="mockup-code mb-6">
        <pre><code>// JavaScript/TypeScript example
async function searchDomains(query) &#123;
  try &#123;
    const response = await fetch('/api/domains/suggest', &#123;
      method: 'POST',
      headers: &#123; 'Content-Type': 'application/json' &#125;,
      body: JSON.stringify(&#123;
        input_text: query,
        input_type: 'idea',
        style: 'brandable',
        num_choices: 10
      &#125;)
    &#125;);

    if (!response.ok) &#123;
      throw new Error(`HTTP $&#123;response.status&#125;: $&#123;response.statusText&#125;`);
    &#125;

    const data = await response.json();
    return data.domains;
  &#125; catch (error) &#123;
    console.error('Domain search failed:', error);
    throw error;
  &#125;
&#125;</code></pre>
      </div>
    </section>

    <!-- Domain Ranking -->
    <section class="mb-16">
      <h2 class="text-3xl font-bold mb-6 flex items-center gap-3">
        <Icon icon="lucide:trending-up" class="h-8 w-8 text-primary" />
        Domain Ranking System
      </h2>

      <div class="alert alert-info mb-6">
        <Icon icon="lucide:info" class="h-5 w-5" />
        <div>
          <div class="font-semibold">GoDaddy-style intelligent domain ranking</div>
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
        <pre><code>// Rate limit exceeded (429)
&#123;
  "detail": &#123;
    "error": "Rate limit exceeded",
    "message": "Maximum 100 requests per minute allowed",
    "retry_after": 45
  &#125;
&#125;</code></pre>
      </div>

      <div class="mockup-code mb-6">
        <pre><code>// Validation error (422)
&#123;
  "detail": [
    &#123;
      "loc": ["body", "input_text"],
      "msg": "Input text cannot be empty",
      "type": "value_error"
    &#125;
  ]
&#125;</code></pre>
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
            <Icon icon="lucide:github" class="h-12 w-12 mx-auto mb-4 text-neutral" />
            <h3 class="font-semibold mb-2">GitHub</h3>
            <p class="text-sm text-base-content/70 mb-3">Source code & issues</p>
            <a href="/" class="btn btn-sm btn-outline">View Repository</a>
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

    <!-- Footer -->
    <footer class="text-center py-8 border-t border-base-300">
      <div class="flex items-center justify-center gap-2 mb-4">
        <Icon icon="lucide:brain" class="h-6 w-6 text-primary" />
        <span class="text-lg font-bold">Domain Finder AI</span>
        <span class="badge badge-primary">v2.2.0</span>
      </div>
      <p class="text-base-content/70 mb-4">
        Intelligent domain suggestions powered by AI
      </p>
      <div class="flex justify-center gap-4 text-sm">
        <a href="/api/health" class="link link-hover">API Status</a>
        <a href="/api/rate-limit" class="link link-hover">Rate Limits</a>
        <a href="mailto:support@example.com" class="link link-hover">Support</a>
        <a href="/" class="link link-hover">GitHub</a>
      </div>
      <p class="text-xs text-base-content/50 mt-4">
        Made with ❤️ for developers who need great domains
      </p>
    </footer>
  </article>
</div>