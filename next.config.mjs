// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;


// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // optional: if you use other image hosts (like localhost, etc.)
  // you can add more here
};

export default nextConfig;