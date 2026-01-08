import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://dragonnzhang.github.io/savings-simulator';
  const locales = ['en', 'zh'];
  const lastModified = new Date();

  const urls: MetadataRoute.Sitemap = [];

  // Root page
  urls.push({
    url: baseUrl,
    lastModified,
    changeFrequency: 'weekly',
    priority: 1,
  });

  // Locale-specific pages
  locales.forEach((locale) => {
    urls.push({
      url: `${baseUrl}/${locale}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: locale === 'zh' ? 0.9 : 0.85,
    });
  });

  return urls;
}
