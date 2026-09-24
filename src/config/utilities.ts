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
    description: 'Compare two JSON documents structurally. Identify added, removed, and changed values instantly.',
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
  'jwt-inspector': {
    id: 'jwt-inspector',
    title: 'JWT Inspector',
    description: 'Inspect a JSON Web Token locally in your browser. Decode header, payload, and claims without sending data to any server.',
    category: 'developer',
    isClientSideOnly: true,
    relatedUtilities: ['json-diff', 'json-formatter'],
    status: 'live',
  },
};

export function getUtility(id: string): UtilityConfig | undefined {
  return UTILITIES[id];
}

export function getUtilitiesByCategory(category: UtilityCategory): UtilityConfig[] {
  return Object.values(UTILITIES).filter((u) => u.category === category);
}
