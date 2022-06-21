/** @type {import('next').NextConfig} */
module.exports = {
  // distDir: 'build', TODO: better build management
  optimizeFonts: false,
  reactStrictMode: true,
  images: {
    domains: ['localhost','api.openar.art','openar.art','baserow.panke.gallery'], 
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
