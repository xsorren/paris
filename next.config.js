/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ignora ESLint solo en builds (Netlify)
  },
};
module.exports = nextConfig;
