export default {
  allowedDevOrigins: [
    "storefront.example.com",
    "storefront.es.example.com",
    "storefront.nl.example.com",
    "www.storefront.example.com",
    "www.storefront.nl.example.com",
  ],

  experimental: {
    ppr: true,
    inlineCss: true,
    useCache: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};
