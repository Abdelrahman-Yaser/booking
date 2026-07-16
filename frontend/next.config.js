/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'isorepublic.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/home_2',
        destination: '/flights',
        permanent: true,
      },
      {
        source: '/home_4',
        destination: '/hotels',
        permanent: true,
      },
      {
        source: '/home_5',
        destination: '/tours',
        permanent: true,
      },
      {
        source: '/home_6',
        destination: '/cruises',
        permanent: true,
      },
      {
        source: '/home_7',
        destination: '/activities',
        permanent: true,
      },
      {
        source: '/home_8',
        destination: '/cars',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig 