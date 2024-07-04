module.exports = {
  apps: [
    {
      name: 'rchat-webhook',
      script: './dist/main.js',
      env: {
        NODE_ENV: 'development',
      },
      env_staging: {
        NODE_ENV: 'staging',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],

  deploy: {
    staging: {
      'post-deploy': 'pm2 reload ecosystem.config.js --env staging',
    },
    production: {
      'post-deploy': 'pm2 reload ecosystem.config.js --env production',
    },
  },
};