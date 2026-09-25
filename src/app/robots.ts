const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bumiversa.dev';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
