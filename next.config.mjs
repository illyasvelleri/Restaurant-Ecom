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
  webpack(config) {
    // CSS loader for slick-carousel (already handled by Next, but we add file-loader for fonts)
    config.module.rules.push({
      test: /\.(eot|woff|woff2|ttf|svg)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/fonts/[name][ext]',
      },
    });

    return config;
  },
};

export default nextConfig;
