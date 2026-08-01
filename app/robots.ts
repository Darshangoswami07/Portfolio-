import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://portfolio-rouge-ten-ric6b2uei5.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/analytics', '/appointments', '/meetings', '/settings', '/ai', '/api/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
