/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: [
            'cdn.sanity.io', // Sanity CDN domain
            'cdn.sanity.images', // Alternative Sanity images domain
        ],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.sanity.io',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'cdn.sanity.images',
                port: '',
                pathname: '/**',
            },
        ],
    },
}

module.exports = nextConfig
