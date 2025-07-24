<!-- src/lib/components/SearchFilters.svelte (Fixed accessibility) -->
<script lang="ts">
  import Icon from '@iconify/svelte';
  
  export let inputType: 'idea' | 'exact_name' | 'base_name';
  export let field: string;
  export let style: 'short' | 'brandable' | 'keyword' | 'creative' | 'professional';
  export let domainPreference: string;
  export let providerPreference: 'name.com' | 'porkbun' | 'any';
  export let maxPrice: number;
  export let numChoices: number;
  export let additionalDomains: string;
  export let showAdvanced: boolean;

  const inputTypeOptions = [
    { value: 'idea', label: 'Business Idea', description: 'Generate suggestions from your concept', icon: 'lucide:lightbulb' },
    { value: 'base_name', label: 'Base Name', description: 'Check different TLDs for a name', icon: 'lucide:globe' },
    { value: 'exact_name', label: 'Exact Domain', description: 'Check specific domain(s)', icon: 'lucide:search' }
  ];

  const styleOptions = [
    { value: 'brandable', label: 'Brandable', description: 'Modern, memorable names', icon: 'lucide:star' },
    { value: 'short', label: 'Short', description: 'Concise, 4-6 characters', icon: 'lucide:minus' },
    { value: 'keyword', label: 'Keyword', description: 'Industry-relevant terms', icon: 'lucide:tag' },
    { value: 'creative', label: 'Creative', description: 'Unique variations', icon: 'lucide:palette' },
    { value: 'professional', label: 'Professional', description: 'Business-focused', icon: 'lucide:briefcase' }
  ];

  const tldOptions = [
    '.com', '.io', '.ai', '.app', '.dev', '.net', '.org', '.co', 
    '.tech', '.online', '.site', '.store', '.shop', 'any'
  ];
</script>

<!-- Input Type Selection -->
<fieldset class="form-control mb-6">
  <legend class="label">
    <span class="label-text font-semibold flex items-center gap-2">
      <Icon icon="lucide:layers" class="h-4 w-4" />
      Search Type
    </span>
  </legend>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
    {#each inputTypeOptions as option}
      <label class="label cursor-pointer justify-start p-4 border border-base-300 rounded-lg hover:bg-base-200 transition-colors" class:bg-primary={inputType === option.value} class:text-primary-content={inputType === option.value}>
        <input 
          type="radio" 
          name="inputType" 
          value={option.value}
          bind:group={inputType}
          class="radio radio-primary mr-3" 
        />
        <div class="flex items-start gap-2">
          <Icon icon={option.icon} class="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <div class="font-medium">{option.label}</div>
            <div class="text-sm opacity-70">{option.description}</div>
          </div>
        </div>
      </label>
    {/each}
  </div>
</fieldset>

<!-- Quick Settings -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
  <div class="form-control">
    <label for="tld-preference" class="label">
      <span class="label-text flex items-center gap-2">
        <Icon icon="lucide:globe" class="h-4 w-4" />
        TLD Preference
      </span>
    </label>
    <select id="tld-preference" bind:value={domainPreference} class="select select-bordered">
      {#each tldOptions as tld}
        <option value={tld}>{tld}</option>
      {/each}
    </select>
  </div>

  <div class="form-control">
    <label for="max-price-filter" class="label">
      <span class="label-text flex items-center gap-2">
        <Icon icon="lucide:dollar-sign" class="h-4 w-4" />
        Max Price
      </span>
    </label>
    <div class="input-group">
      <span class="bg-base-200 px-3 py-2 border border-base-300 rounded-l-lg">$</span>
      <input 
        id="max-price-filter"
        type="number" 
        bind:value={maxPrice}
        min="1" 
        max="1000" 
        class="input input-bordered flex-1 rounded-l-none"
      />
    </div>
  </div>

  <div class="form-control">
    <label for="num-choices-filter" class="label">
      <span class="label-text flex items-center gap-2">
        <Icon icon="lucide:hash" class="h-4 w-4" />
        Results
      </span>
    </label>
    <input 
      id="num-choices-filter"
      type="number" 
      bind:value={numChoices}
      min="1" 
      max="20" 
      class="input input-bordered"
    />
  </div>
</div>

<!-- Advanced Options -->
{#if showAdvanced}
  <div class="space-y-4 border-t pt-6 mt-6">
    <!-- Style Selection for AI Generation -->
    {#if inputType === 'idea'}
      <fieldset class="form-control">
        <legend class="label">
          <span class="label-text font-semibold flex items-center gap-2">
            <Icon icon="lucide:palette" class="h-4 w-4" />
            Generation Style
          </span>
        </legend>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {#each styleOptions as option}
            <label class="label cursor-pointer justify-start p-3 border border-base-300 rounded-lg hover:bg-base-200 transition-colors" class:bg-secondary={style === option.value} class:text-secondary-content={style === option.value}>
              <input 
                type="radio" 
                name="style" 
                value={option.value}
                bind:group={style}
                class="radio radio-secondary mr-3" 
              />
              <div class="flex items-start gap-2">
                <Icon icon={option.icon} class="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <div class="font-medium">{option.label}</div>
                  <div class="text-sm opacity-70">{option.description}</div>
                </div>
              </div>
            </label>
          {/each}
        </div>
      </fieldset>

      <div class="form-control">
        <label for="field-filter" class="label">
          <span class="label-text flex items-center gap-2">
            <Icon icon="lucide:building" class="h-4 w-4" />
            Industry/Field (optional)
          </span>
        </label>
        <input 
          id="field-filter"
          type="text" 
          bind:value={field}
          placeholder="e.g., technology, healthcare, e-commerce"
          class="input input-bordered"
        />
      </div>
    {/if}

    <div class="form-control">
      <label for="provider-filter" class="label">
        <span class="label-text flex items-center gap-2">
          <Icon icon="lucide:server" class="h-4 w-4" />
          Provider
        </span>
      </label>
      <select id="provider-filter" bind:value={providerPreference} class="select select-bordered">
        <option value="name.com">Name.com (Fast, Recommended)</option>
        <option value="porkbun">Porkbun (Slow, Different Pricing)</option>
        <option value="any">All Providers (Best Coverage)</option>
      </select>
      <label for="provider-filter" class="label">
        <span class="label-text-alt text-base-content/60">
          Name.com is recommended for faster bulk checking
        </span>
      </label>
    </div>

    {#if inputType === 'exact_name'}
      <div class="form-control">
        <label for="additional-domains-filter" class="label">
          <span class="label-text flex items-center gap-2">
            <Icon icon="lucide:plus" class="h-4 w-4" />
            Additional Domains (comma-separated)
          </span>
        </label>
        <textarea 
          id="additional-domains-filter"
          bind:value={additionalDomains}
          placeholder="example.io, mycompany.ai, startup.dev"
          class="textarea textarea-bordered"
          rows="2"
        ></textarea>
      </div>
    {/if}
  </div>
{/if}