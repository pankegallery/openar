/** @type {import('next').NextConfig} */
module.exports = {
  // distDir: 'build', TODO: better build management
  reactStrictMode: true,
  images: {
    domains: ['localhost'], //TODO: add Api
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push(
      {
        test: /\.svg$/,
        issuer: {
          and: [/\.(js|ts)x?$/]
        },
        use: ['@svgr/webpack'],
      }
    );
    config.module.rules.push(
      {
        test: /\.md$/,
        use: 'raw-loader',
      }
    );
    return config
  },
}
