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
  
  export {};