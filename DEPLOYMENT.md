# Deployment Guide — ExtremeAmps Next.js

## Prerequisites

- Node.js 20+ on the server
- PM2: `npm install -g pm2`
- Nginx installed and configured

---

## 1. Build Locally

```bash
cd D:\ExtremeAmpsNextJS
npm run build
```

Ensure the build completes with no errors.

---

## 2. Transfer Files to Server

Copy these to `/var/www/extremeamps-nextjs/` on the server:

```
.next/
public/
package.json
package-lock.json
ecosystem.config.cjs
next.config.ts
```

Create `.env.production` on the server (do NOT commit this file):

```
NEXT_PUBLIC_API_BASE_URL=https://www.gennest.in/ecomapp/api
API_BASE_URL=https://www.gennest.in/ecomapp/api
NEXT_PUBLIC_SITE_URL=https://www.extremeamps.in
NEXT_PUBLIC_IMAGE_BASE_URL=https://www.gennest.in

# IMPORTANT: Set API_INTERNAL_BASE_URL to the internal port your ASP.NET Core
# API listens on. This allows Next.js server-side SSR fetches to bypass Nginx
# and hit the backend directly (faster, avoids routing loops).
# Find the port in your ASP.NET appsettings.json or systemd service file.
# Example: API_INTERNAL_BASE_URL=http://localhost:5000/api
API_INTERNAL_BASE_URL=http://localhost:5000/api
```

> **Why this matters:** When Next.js runs server-side rendering for product pages,
> it fetches from the API to build SEO metadata and JSON-LD. Without `API_INTERNAL_BASE_URL`,
> this server-to-server fetch goes through the public URL and Nginx, which may return
> the frontend HTML instead of JSON. With the internal URL, it hits ASP.NET Core directly.

---

## 3. Install Dependencies on Server

```bash
cd /var/www/extremeamps-nextjs
npm install --omit=dev
```

---

## 4. Start with PM2

```bash
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup
```

---

## 5. Configure Nginx

```bash
sudo cp nginx-nextjs.conf /etc/nginx/sites-available/extremeamps
sudo ln -s /etc/nginx/sites-available/extremeamps /etc/nginx/sites-enabled/
sudo nginx -t
sudo nginx -s reload
```

---

## 6. Health Check

```bash
curl https://www.extremeamps.in/
curl https://www.extremeamps.in/sitemap.xml
curl https://www.extremeamps.in/robots.txt
```

---

## 7. SEO Verification

- Visit https://www.extremeamps.in/product/some-product--variantid in browser
- View page source — confirm product `<title>` and JSON-LD are in the raw HTML
- Submit sitemap to Google Search Console

---

## 8. Updates

```bash
# After rebuilding locally and transferring .next/:
pm2 reload extremeamps-nextjs
```
