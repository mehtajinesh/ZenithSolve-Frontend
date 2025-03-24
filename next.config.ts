/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    dirs: ['src'], // Only run ESLint on the 'src' directory during production builds
  },
};

module.exports = nextConfig;
