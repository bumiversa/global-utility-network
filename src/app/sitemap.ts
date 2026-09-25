import { UTILITIES } from '@/config/utilities';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bumiversa.dev';

export default function sitemap() {
  // 1. Homepage
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
  ];

  // 2. Dynamic Utility Routes (Only 'live' status)
  const utilityRoutes = Object.values(UTILITIES)
    .filter((utility) => utility.status === 'live')
    .map((utility) => ({
      url: `${baseUrl}/tools/${utility.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

  return [...routes, ...utilityRoutes];
}
