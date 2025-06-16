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

  $: buttonText = (() => {
    // When calendar is open, show date or selection prompt
    if (isOpen) {
      if (selectedDate) {
        return dayjs(selectedDate).format('MMMM D, YYYY');
      } else {
        return 'Click to set deadline';
      }
    }

    // When calendar is closed
    if (!selectedDate) {
      return 'Click to set deadline';
    }

    const diff = dayjs(selectedDate)
      .startOf('day')
      .diff(dayjs().startOf('day'), 'day');

    if (diff < 0) {
      return 'Deadline past';
    } else if (diff === 0) {
      return 'Due today';
    } else if (diff <= 7) {
      if (diff === 1) {
        return 'Due in 1 day';
      } else {
        return `Due in ${diff} days`;
      }
    } else {
      return `Due on ${dayjs(selectedDate).format('MMMM D, YYYY')}`;
    }
  })();

  // Also make getButtonColor reactive:
  $: buttonColor = (() => {
    if (!selectedDate) return 'btn-neutral';
    const diff = dayjs(selectedDate)
      .startOf('day')
      .diff(dayjs().startOf('day'), 'day');

    if (diff < 0) return 'btn-info';
    if (diff <= 3) return 'btn-error';
    if (diff <= 7) return 'btn-warning';
    return 'btn-neutral';
  })();

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
    class="btn {buttonColor} w-50"
    on:click={toggleCalendar}
  >
    {buttonText}
  </button>

  <input type="hidden" bind:this={inputEl} />
</div>

<style>
  :global(.pika-single) {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
    padding: 0.75rem;
    width: max-content;
  }

  :global(.pika-title) {
    margin-bottom: 0.5rem;
    text-align: center;
    font-weight: 500;
    font-size: 1rem;
    color: #374151;
  }

  :global(.pika-prev),
  :global(.pika-next) {
    color: #6b7280;
    transition: color 0.2s ease;
  }

  :global(.pika-prev:hover),
  :global(.pika-next:hover) {
    color: #374151;
  }

  :global(.pika-table) {
    width: 100%;
    border-collapse: collapse;
  }

  :global(.pika-table th) {
    color: #6b7280;
    font-size: 0.75rem;
    font-weight: 500;
    padding-bottom: 0.25rem;
  }

  :global(.pika-button) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    background-color: white;
    font-weight: 500;
    color: #374151;
    transition: background 0.2s ease;
  }

  :global(.pika-button:hover) {
    background-color: black;
  }

  :global(.pika-button.is-selected) {
    background-color: #3b82f6;
    color: white;
  }

  :global(.pika-button.is-today) {
    background-color: #fef3c7;
    color: #92400e;
  }

  :global(.pika-button.is-disabled) {
    color: #d1d5db;
    pointer-events: none;
  }


</style>