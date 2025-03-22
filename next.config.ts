/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    dirs: ['src'], // Only run ESLint on the 'src' directory during production builds
  },
};

module.exports = nextConfig;
