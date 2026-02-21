// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       // Cloudinary (your real images)
//       {
//         protocol: "https",
//         hostname: "res.cloudinary.com",
//         port: "",
//         pathname: "/**",
//       },
//       // Placeholder images (via.placeholder.com)
//       {
//         protocol: "https",
//         hostname: "via.placeholder.com",
//         port: "",
//         pathname: "/**",
//       },
//       // Optional: if you use other CDNs
//       // {
//       //   protocol: "https",
//       //   hostname: "images.unsplash.com",
//       //   pathname: "/**",
//       // },
//     ],
//   },

//   // Keep your slick-carousel font fix (safe & working)
//   webpack(config) {
//     config.module.rules.push({
//       test: /\.(eot|woff|woff2|ttf|svg)$/,
//       type: "asset/resource",
//       generator: {
//         filename: "static/fonts/[name][ext]",
//       },
//     });

//     return config;
//   },

//   // Optional but recommended
//   reactStrictMode: true,
//   swcMinify: true,
// };

// export default nextConfig;



/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.(eot|woff|woff2|ttf|svg)$/,
      type: "asset/resource",
      generator: {
        filename: "static/fonts/[name][ext]",
      },
    });
    return config;
  },

  reactStrictMode: true,
  swcMinify: true,

  // ──────────────────────────────────────────────
  // FIX: Prevent static export / prerender crash
  // Remove or comment this if you ever want static export later
  // output: 'export',   ← DO NOT ADD THIS
  // Instead force dynamic rendering globally (safe for dashboard pages)
  experimental: {
    serverComponentsExternalPackages: ['mongoose'], // if using mongoose
  },
};

export default nextConfig;