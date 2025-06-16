<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import dayjs from 'dayjs';
  import 'pikaday/css/pikaday.css';

  export let selectedDate: Date | null = null;
  export let onSelect: (date: Date) => void = () => {};

  let picker: any;
  let inputEl: HTMLInputElement;
  let buttonEl: HTMLButtonElement;
  let containerEl: HTMLDivElement;
  let isOpen = false;

  function toggleCalendar() {
    if (!picker) return;
    picker.isVisible() ? picker.hide() : picker.show();
  }

  function getButtonText() {
    if (isOpen) {
      return selectedDate
        ? dayjs(selectedDate).format('MMMM D, YYYY')
        : 'Select a date';
    }
    if (!selectedDate) return 'Select a date';

    const diff = dayjs(selectedDate)
      .startOf('day')
      .diff(dayjs().startOf('day'), 'day');

    if (diff < 0) return 'Deadline past';
    if (diff === 0) return 'Due today';
    return diff <= 7
      ? `Due in ${diff} day${diff > 1 ? 's' : ''}`
      : dayjs(selectedDate).format('MMMM D, YYYY');
  }

  function getButtonColor() {
    if (!selectedDate) return 'btn-neutral';
    const diff = dayjs(selectedDate)
      .startOf('day')
      .diff(dayjs().startOf('day'), 'day');

    if (diff < 0) return 'btn-info';
    if (diff <= 3) return 'btn-error';
    if (diff <= 7) return 'btn-warning';
    return 'btn-neutral';
  }

  onMount(async () => {
    if (!browser) return;

    const { default: Pikaday } = await import('pikaday');
    picker = new Pikaday({
      field: inputEl,
      trigger: buttonEl,           // click this to open
      container: containerEl,      // append calendar here
      bound: true,                // auto-show/hide on focus/blur
      format: 'YYYY-MM-DD',
      onSelect(date: Date) {
        selectedDate = date;
        onSelect(date);
      },
      onOpen() {
        isOpen = true;
      },
      onClose() {
        isOpen = false;
      }
    });
  });

  onDestroy(() => picker?.destroy());
</script>

<div class="relative inline-block" bind:this={containerEl}>
  <button
    bind:this={buttonEl}
    type="button"
    class="btn {getButtonColor()}"
    on:click={toggleCalendar}
  >
    {getButtonText()}
  </button>

  <!-- Hidden input just to give Pikaday a field to bind to -->
  <input type="hidden" bind:this={inputEl} />
</div>

<style>
  :global(.pika-single) {
    background: white;          /* change calendar background */
    border: 2px solid #4b5563;  /* tweak border color & width */
    border-radius: 0.5rem;      /* round corners more */
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }

  :global(.pika-title) {
    background: #f9fafb;        /* header bar color */
    color: #111827;             /* header text color */
  }

  :global(.pika-prev), 
  :global(.pika-next) {
    color: #6b7280;             /* arrow color */
  }

  :global(.pika-table th) {
    font-weight: 600;
    color: #4b5563;             /* weekday labels */
  }

  :global(.pika-button) {
    border-radius: 0.25rem;
    margin: 0.1rem;
    width: 2.25rem;
    height: 2.25rem;
  }

  :global(.pika-button:hover) {
    background: #f3f4f6;        /* hover state */
  }

  :global(.is-today) {
    border-bottom: 2px solid #3b82f6; /* highlight today */
  }

  :global(.is-selected) {
    background: #3b82f6;        /* selected date bg */
    color: white;               /* selected date text */
  }
</style>

