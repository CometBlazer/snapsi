<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import dayjs from 'dayjs';

  export let selectedDate: Date | null = null;
  export let onSelect: (date: Date) => void = () => {};

  let inputEl: HTMLInputElement;
  let picker: any;

  onMount(async () => {
    if (!browser) return;                   // SSR guard
    const { default: Pikaday } = await import('pikaday');
    picker = new Pikaday({
      field: inputEl,
      format: 'YYYY-MM-DD',
      onSelect: (date: Date) => {
        selectedDate = date;
        onSelect(date);
      }
    });
  });

  onDestroy(() => picker?.destroy());
</script>

<div class="flex flex-col gap-2">
  <input
    bind:this={inputEl}
    type="text"
    class="input input-bordered w-full max-w-xs"
    placeholder="Select a date"
    readonly
  />

  {#if selectedDate}
    <p class="text-sm text-gray-500">
      You picked: <span class="font-medium">{dayjs(selectedDate).format('MMMM D, YYYY')}</span>
    </p>
  {/if}
</div>

<style>
  /* Optional minimal overrides */
  /* .pika-single {
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    font-family: ui-sans-serif, system-ui, sans-serif;
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }

  .pika-table th,
  .pika-table td {
    padding: 0.5rem;
  }

  .is-selected {
    background-color: #3b82f6;
    color: white;
    border-radius: 0.25rem;
  }

  .is-today {
    border-bottom: 2px solid #3b82f6;
  } */
</style>
