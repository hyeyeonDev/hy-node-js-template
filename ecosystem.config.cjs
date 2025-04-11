module.exports = {
  apps: [
    {
      name: 'client-a',
      script: './dist/scripts/client-a.js',
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'client-b',
      script: './dist/scripts/client-b.js',
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'client-c',
      script: './dist/scripts/client-c.js',
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
