/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'objectProxy.1205.moe',
                port: ''
            },
            {
                protocol: 'https',
                hostname: 'objectproxy.1205.moe',
                port: ''
            },
        ],
    },
}

module.exports = nextConfig
