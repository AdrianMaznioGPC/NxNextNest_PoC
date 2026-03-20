export default {
  allowedDevOrigins: [
    "winparts.ie.localhost",
    "winparts.es.localhost",
    "winparts.nl.localhost",
    "www.winparts.ie.localhost",
    "www.winparts.es.localhost",
    "www.winparts.nl.localhost",
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
