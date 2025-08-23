/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['mongodb']
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            // Exclude MongoDB and other server-only packages from client bundle
            config.resolve.fallback = {
                ...config.resolve.fallback,
                net: false,
                dns: false,
                tls: false,
                fs: false,
                request: false,
                'mongodb-client-encryption': false,
            };

            // Exclude MongoDB entirely from client bundle
            config.externals = config.externals || [];
            config.externals.push('mongodb');
        }
        return config;
    },
    // Enable PWA features
    async headers() {
        return [
            {
                source: '/sw.js',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=0, must-revalidate',
                    },
                    {
                        key: 'Service-Worker-Allowed',
                        value: '/',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
