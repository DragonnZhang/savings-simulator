import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/.next', '/api'],
      },
      {
        userAgent: 'Baiduspider',
        allow: '/',
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
    ],
    sitemap: [
      'https://dragonnzhang.github.io/savings-simulator/sitemap.xml',
      'https://dragonnzhang.github.io/savings-simulator/sitemap-zh.xml',
    ],
  };
}
