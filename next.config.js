/** @type {import('next').NextConfig} */
/*const nextConfig = {
  reactStrictMode: true,
}
*/

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

//module.exports = nextConfig