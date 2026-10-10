import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.extremeamps.in';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/sign-in', '/sign-up', '/checkout', '/payment/', '/my-orders', '/user/'],
      },
    ],
    sitemap: [
      `${SITE_URL}/sitemap.xml`,
      'https://api.extremeamps.in/api/sitemap/sitemap.xml',
    ],
  };
}
