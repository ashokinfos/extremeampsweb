/**
 * Returns the common headers needed for server-to-server API calls.
 *
 * The TenantMiddleware on the ASP.NET Core API resolves the tenant (ClientId)
 * from either:
 *   1. The browser `Origin` header  — set automatically by browsers on XHR/fetch
 *   2. The `X-Client-Domain` header — set by us on SSR server-side fetch calls
 *      (which have no browser Origin because they run on the Next.js server)
 *
 * Usage in Server Components / route handlers:
 *   const res = await fetch(url, { headers: serverFetchHeaders(), next: { revalidate: 3600 } });
 */
export function serverFetchHeaders(): Record<string, string> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.extremeamps.in';
  // Extract just the hostname e.g. "www.extremeamps.in"
  const domain = siteUrl.replace(/^https?:\/\//, '').split('/')[0];
  return {
    'Content-Type': 'application/json',
    'X-Client-Domain': domain,
  };
}
