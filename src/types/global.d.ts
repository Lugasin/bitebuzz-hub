// Global type definitions for the project

// Ensure Jest globals are recognized
declare global {
  // Jest testing globals
  const describe: (name: string, fn: () => void) => void;
  const beforeAll: (fn: () => void) => void;
  const beforeEach: (fn: () => void) => void;
  const afterAll: (fn: () => void) => void;
  const afterEach: (fn: () => void) => void;
  const it: (name: string, fn: () => void | Promise<void>) => void;
  const test: (name: string, fn: () => void | Promise<void>) => void;
  const expect: any;
  const jest: any;
  
  // Other global interfaces can be added here
  interface Window {
    // Add window-specific global properties here
    dataLayer?: any[];
    analytics?: any;
  }
}

export {};
