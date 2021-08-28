/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'], //TODO: add Api
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.concat([
      {
        test: /\.svg$/,
        issuer: {
          and: [/\.(js|ts)x?$/]
        },
        use: ['@svgr/webpack'],
      },
      {
        test: /\.md$/,
        use: 'raw-loader',
      }
    ]);
    return config
  },
}
