// src/config/utilities.ts

export type UtilityCategory = 'developer' | 'text' | 'image' | 'calculator' | 'generator';

export interface UtilityConfig {
  id: string;
  title: string;
  description: string;
  category: UtilityCategory;
  isClientSideOnly: boolean;
  relatedUtilities: string[];
  status: 'live' | 'preview' | 'coming-soon';
}

export const UTILITIES: Record<string, UtilityConfig> = {
  'json-diff': {
    id: 'json-diff',
    title: 'JSON Diff & Compare',
    description: 'Compare two JSON documents structurally. Identify added, removed, and changed values instantly. 100% processed in your browser.',
    category: 'developer',
    isClientSideOnly: true,
    relatedUtilities: [], // Akan diisi saat kita tambah utility baru (misal: json-formatter)
    status: 'live', // <-- DIUBAH DARI 'preview' MENJADI 'live'
  },
};

export function getUtility(id: string): UtilityConfig | undefined {
  return UTILITIES[id];
}

export function getUtilitiesByCategory(category: UtilityCategory): UtilityConfig[] {
  return Object.values(UTILITIES).filter((u) => u.category === category);
}
