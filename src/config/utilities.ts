// src/config/utilities.ts

export type UtilityCategory = 'developer' | 'text' | 'image' | 'calculator' | 'generator';

export interface UtilityConfig {
  id: string; // URL slug, e.g., 'json-diff'
  title: string;
  description: string;
  category: UtilityCategory;
  isClientSideOnly: boolean; // Core principle: true = no server processing
  relatedUtilities: string[]; // Array of other utility IDs for cross-linking
  status: 'live' | 'preview' | 'coming-soon';
}

// Registry of all utilities in the network
export const UTILITIES: Record<string, UtilityConfig> = {
  'json-diff': {
    id: 'json-diff',
    title: 'JSON Diff & Compare',
    description: 'Compare two JSON documents structurally. Identify added, removed, and changed values instantly. 100% processed in your browser.',
    category: 'developer',
    isClientSideOnly: true,
    relatedUtilities: ['json-formatter', 'json-validator'],
    status: 'preview', // Currently living at jsondiff.bumiversa.dev
  },
  // Node #02 will be added here when ready
  // 'json-formatter': {
  //   id: 'json-formatter',
  //   title: 'JSON Formatter & Validator',
  //   ...
  // }
};

// Helper to get a utility by ID safely
export function getUtility(id: string): UtilityConfig | undefined {
  return UTILITIES[id];
}

// Helper to get all utilities in a specific category
export function getUtilitiesByCategory(category: UtilityCategory): UtilityConfig[] {
  return Object.values(UTILITIES).filter((u) => u.category === category);
}
