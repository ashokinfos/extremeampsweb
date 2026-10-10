module.exports = {
  apps: [
    {
      name: 'extremeamps-nextjs',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: '/var/www/extremeamps-nextjs',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_PUBLIC_API_BASE_URL: 'https://www.gennest.in/ecomapp/api',
        API_BASE_URL: 'https://www.gennest.in/ecomapp/api',
        NEXT_PUBLIC_IMAGE_BASE_URL: 'https://www.gennest.in',
        NEXT_PUBLIC_SITE_URL: 'https://www.extremeamps.in',
      },
    },
  ],
};
