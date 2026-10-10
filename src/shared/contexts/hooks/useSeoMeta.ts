'use client';

import { useEffect } from 'react';

interface SeoMetaOptions {
  title: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  noIndex?: boolean;
  ogImage?: string;
  ogType?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.extremeamps.in';

export function useSeoMeta({
  title,
  description,
  keywords,
  canonical,
  noIndex = false,
  ogImage,
  ogType = 'website',
}: SeoMetaOptions) {
  useEffect(() => {
    document.title = title;

    const setMeta = (selector: string, content: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        const [attr, val] = selector.replace('meta[', '').replace(']', '').split('="');
        el.setAttribute(attr, val.replace('"', ''));
        document.head.appendChild(el);
      }
      el.content = content;
    };

    const setLink = (href: string) => {
      let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement('link');
        el.rel = 'canonical';
        document.head.appendChild(el);
      }
      el.href = href;
    };

    const canonicalUrl = `${BASE_URL}${canonical ?? ''}`;

    if (description) {
      setMeta('meta[name="description"]', description);
      setMeta('meta[property="og:description"]', description);
      setMeta('meta[name="twitter:description"]', description);
    }

    if (keywords) setMeta('meta[name="keywords"]', keywords);

    setMeta('meta[name="robots"]', noIndex ? 'noindex, follow' : 'index, follow');
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:type"]', ogType ?? 'website');
    setMeta('meta[property="og:url"]', canonicalUrl);
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:card"]', 'summary_large_image');
    setMeta('meta[name="twitter:url"]', canonicalUrl);
    setLink(canonicalUrl);

    if (ogImage) {
      setMeta('meta[property="og:image"]', ogImage);
      setMeta('meta[name="twitter:image"]', ogImage);
    }
  }, [title, description, keywords, canonical, noIndex, ogImage, ogType]);
}
