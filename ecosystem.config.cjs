/**
 * PM2 Ecosystem Config
 *
 * Supports two environments driven by the CI/CD pipeline:
 *
 *   Staging:    pm2 start ecosystem.config.cjs --only extremeamps-staging --env deploy
 *               Triggered by deploy-staging.yml on pushes to `develop`
 *
 *   Production: pm2 start ecosystem.config.cjs --only extremeamps-production --env deploy
 *               Triggered by deploy-production.yml on pushes to `main`
 *
 * "--env deploy" activates the env_deploy block in each app's config.
 * PM2 requires an env_ prefix on blocks; "deploy" is used here instead of
 * "production" to avoid confusion — it just means "use the deployed config".
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
      env_deploy: {
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
      env_deploy: {
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
