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
    relatedUtilities: ['json-formatter', 'jwt-inspector'],
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
    relatedUtilities: ['base64'],
    status: 'live',
  },
  'base64': {
    id: 'base64',
    title: 'Base64 Encoder & Decoder',
    description: 'Encode and decode text to Base64 or Base64URL instantly with full UTF-8 support. 100% client-side.',
    category: 'developer',
    isClientSideOnly: true,
    relatedUtilities: ['jwt-inspector'],
    status: 'live',
  },
};

export function getUtility(id: string): UtilityConfig | undefined {
  return UTILITIES[id];
}

export function getUtilitiesByCategory(category: UtilityCategory): UtilityConfig[] {
  return Object.values(UTILITIES).filter((u) => u.category === category);
}
