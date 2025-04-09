/** @type {import('next').NextConfig} */
const nextConfig = {
  //output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = {
  eslint: {
    ignoreDuringBuilds: true, // ⛳ allows deploy even with ESLint issues
  },
}

