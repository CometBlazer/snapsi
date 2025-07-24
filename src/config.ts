// src/config.ts
export const WebsiteName = "Domain Finder API";
export const WebsiteDescription = "Find the perfect domain name with suggestions, intelligent ranking, and real-time availability checking";
export const WebsiteBaseUrl = "https://snapsi.me"; // Update this to your actual domain

// Feature flags
export const FEATURES = {
  showAdvancedOptions: true,
  showRankingDetails: true,
  enableAnalytics: true,
} as const;