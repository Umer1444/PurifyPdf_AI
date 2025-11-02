/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false, // Disable SWC to avoid parsing issues with undici

  webpack: (config, { isServer, webpack }) => {
    // Handle PDF.js worker
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };

    // Fix undici parsing issues for client-side
    if (!isServer) {
      // Completely exclude undici from client bundle
      config.externals = config.externals || [];
      config.externals.push("undici");

      // Add fallbacks for Node.js modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        url: false,
        zlib: false,
        assert: false,
        os: false,
        path: false,
        querystring: false,
        util: false,
        buffer: false,
        events: false,
      };

      // Ignore undici completely
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^undici$/,
        })
      );

      // Replace undici with empty module
      config.resolve.alias = {
        ...config.resolve.alias,
        undici: false,
        "node-fetch": false,
      };
    }

    return config;
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
