// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
	  // interface Error {}
	  // interface Locals {}
	  // interface PageData {}
	  // interface Platform {}
	}
	
	interface Window {
	  fs: {
		readFile: (path: string, options?: { encoding?: string }) => Promise<Uint8Array | string>;
	  };
	}
  }

//   declare module 'pikaday' {
//   interface PikadayOptions {
//     field?: HTMLElement;
//     trigger?: HTMLElement;
//     bound?: boolean;
//     position?: string;
//     reposition?: boolean;
//     format?: string;
//     formatStrict?: boolean;
//     defaultDate?: Date;
//     setDefaultDate?: boolean;
//     firstDay?: number;
//     minDate?: Date;
//     maxDate?: Date;
//     disableWeekends?: boolean;
//     disableDayFn?: (date: Date) => boolean;
//     yearRange?: number | number[];
//     showWeekNumber?: boolean;
//     isRTL?: boolean;
//     i18n?: Record<string, unknown>;
//     yearSuffix?: string;
//     showMonthAfterYear?: boolean;
//     showDaysInNextAndPreviousMonths?: boolean;
//     numberOfMonths?: number;
//     mainCalendar?: string;
//     theme?: string;
//     onSelect?: (date: Date) => void;
//     onOpen?: () => void;
//     onClose?: () => void;
//     onDraw?: () => void;
//   }

//   export default class Pikaday {
//     constructor(options: PikadayOptions);
//     getDate(): Date | null;
//     setDate(date: Date | string | null, preventOnSelect?: boolean): void;
//     gotoDate(date: Date): void;
//     gotoToday(): void;
//     gotoMonth(month: number): void;
//     nextMonth(): void;
//     prevMonth(): void;
//     gotoYear(year: number): void;
//     setMinDate(date: Date): void;
//     setMaxDate(date: Date): void;
//     setStartRange(date: Date): void;
//     setEndRange(date: Date): void;
//     draw(force?: boolean): void;
//     adjustPosition(): void;
//     show(): void;
//     hide(): void;
//     isVisible(): boolean;
//     destroy(): void;
//   }
// }
  
  export {};