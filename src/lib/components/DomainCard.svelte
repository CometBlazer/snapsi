<!-- src/lib/components/DomainCard.svelte -->
<script lang="ts">
  import Icon from '@iconify/svelte';
  import type { DomainResult } from '$lib/api';
  
  export let domain: DomainResult;
  export let index: number;
  export let showAdvanced: boolean = false;

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

  function openRegistrar(domain: string, registrar: string) {
    const urls = {
      'name.com': `https://www.name.com/domain/search/${domain}`,
      'porkbun': `https://porkbun.com/checkout/search?q=${domain}`,
    };
    
    const url = urls[registrar] || `https://www.google.com/search?q=register+${domain}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }
</script>

<div class="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-shadow">
  <div class="card-body p-6">
    <!-- Domain Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div class="badge badge-lg {getScoreColor(domain.score)} badge-outline">
          #{index + 1}
        </div>
        <h3 class="text-xl font-bold text-base-content break-all">{domain.domain}</h3>
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

    <!-- Availability Status -->
    <div class="flex items-center gap-2 mb-4">
      {#if domain.available}
        <Icon icon="lucide:check-circle" class="h-5 w-5 text-success" />
        <span class="text-success font-semibold">Available</span>
      {:else}
        <Icon icon="lucide:x-circle" class="h-5 w-5 text-error" />
        <span class="text-error font-semibold">Not Available</span>
      {/if}
      <div class="badge badge-ghost ml-auto">{domain.registrar}</div>
    </div>

    <!-- Pricing Info -->
    {#if domain.price_first_year && domain.available}
      <div class="p-3 bg-base-200 rounded-lg mb-4">
        <div class="flex items-center justify-between">
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
          <button 
            class="btn btn-primary btn-sm"
            on:click={() => openRegistrar(domain.domain, domain.registrar)}
          >
            <Icon icon="lucide:external-link" class="h-4 w-4 mr-1" />
            Register
          </button>
        </div>
      </div>
    {/if}

    <!-- Deal Info -->
    {#if domain.deal_info}
      <div class="text-sm text-base-content/70 mb-4 p-2 bg-warning/10 rounded border-l-4 border-warning">
        <Icon icon="lucide:tag" class="h-4 w-4 inline mr-1" />
        {domain.deal_info}
      </div>
    {/if}

    <!-- Ranking Factors (Advanced) -->
    {#if domain.ranking_factors && showAdvanced}
      <div class="collapse collapse-arrow border border-base-300 bg-base-100/50 mb-4">
        <input type="checkbox" />
        <div class="collapse-title text-sm font-medium">
          <Icon icon="lucide:bar-chart" class="h-4 w-4 inline mr-2" />
          Ranking Details
        </div>
        <div class="collapse-content text-xs space-y-1">
          {#each Object.entries(domain.ranking_factors) as [key, value]}
            {#if typeof value === 'number' && key !== 'final_score'}
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
    <div class="flex justify-between items-center">
      <div class="badge badge-outline capitalize">
        <Icon icon="lucide:sparkles" class="h-3 w-3 mr-1" />
        {domain.input_source.replace('_', ' ')}
      </div>
      {#if !domain.available}
        <button class="btn btn-ghost btn-sm" disabled>
          <Icon icon="lucide:x" class="h-4 w-4 mr-1" />
          Unavailable
        </button>
      {:else if !domain.price_first_year}
        <button 
          class="btn btn-outline btn-sm"
          on:click={() => openRegistrar(domain.domain, domain.registrar)}
        >
          <Icon icon="lucide:external-link" class="h-4 w-4 mr-1" />
          Check Price
        </button>
      {/if}
    </div>
  </div>
</div>