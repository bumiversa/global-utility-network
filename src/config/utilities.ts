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
    relatedUtilities: ['json-formatter'],
    status: 'live',
  },
  'json-formatter': {
    id: 'json-formatter',
    title: 'JSON Formatter & Minifier',
    description: 'Beautify or compress your JSON data instantly. Format, validate, and minify JSON directly in your browser.',
    category: 'developer',
    isClientSideOnly: true,
    relatedUtilities: ['json-diff'],
    status: 'live',
  },
};

export function getUtility(id: string): UtilityConfig | undefined {
  return UTILITIES[id];
}

export function getUtilitiesByCategory(category: UtilityCategory): UtilityConfig[] {
  return Object.values(UTILITIES).filter((u) => u.category === category);
}
