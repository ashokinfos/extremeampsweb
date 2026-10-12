/**
 * PM2 Ecosystem Config
 *
 * Supports two environments driven by the CI/CD pipeline:
 *
 *   Staging:    pm2 start ecosystem.config.cjs --env production --name extremeamps-staging
 *               Triggered by deploy-staging.yml on pushes to `develop`
 *
 *   Production: pm2 start ecosystem.config.cjs --env production --name extremeamps-production
 *               Triggered by deploy-production.yml on pushes to `main`
 *
 * The CI workflow copies the correct .env.staging / .env.production file to
 * $APP_DIR/.env.production before reloading PM2, so process.env is already
 * populated when these values are read at start/reload time.
 */

const STAGING_APP_DIR =
  process.env.APP_DIR || '/var/www/myapps/staging/extremeamps';

const PRODUCTION_APP_DIR =
  process.env.APP_DIR || '/var/www/myapps/production/extremeamps';

module.exports = {
  apps: [
    // ── Staging ──────────────────────────────────────────────────────────────
    {
      name: 'extremeamps-staging',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: STAGING_APP_DIR,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 8000,
        NEXT_PUBLIC_API_BASE_URL:
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          'https://staging-api.ecom.gennestlabs.com',
        API_BASE_URL:
          process.env.API_BASE_URL ||
          'https://staging-api.ecom.gennestlabs.com',
        NEXT_PUBLIC_SITE_URL:
          process.env.NEXT_PUBLIC_SITE_URL || 'https://uat.extremeamps.in',
      },
    },

    // ── Production ───────────────────────────────────────────────────────────
    {
      name: 'extremeamps-production',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: PRODUCTION_APP_DIR,
      instances: 'max', // use all CPU cores in production
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 8000,
        NEXT_PUBLIC_API_BASE_URL:
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          'https://api.ecom.gennestlabs.com',
        API_BASE_URL:
          process.env.API_BASE_URL || 'https://api.ecom.gennestlabs.com',
        NEXT_PUBLIC_SITE_URL:
          process.env.NEXT_PUBLIC_SITE_URL || 'https://www.extremeamps.in',
      },
    },
  ],
};
