/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["m.media-amazon.com", "res.cloudinary.com"],
  },
};

module.exports = nextConfig;
