import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
    poweredByHeader: false,
    async headers() {
        return [{
            source: '/:path*',
            headers: [
                { key: 'X-Content-Type-Options', value: 'nosniff' },
                { key: 'X-Frame-Options', value: 'DENY' },
                { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
            ],
        }];
    },
    // The blog is switched off (routes in config.js); send old links home instead of an empty page.
    async redirects() {
        return [
            { source: '/blog', destination: '/', permanent: false },
            { source: '/blog/:path*', destination: '/', permanent: false },
            { source: '/:locale(en)/blog/:path*', destination: '/', permanent: false },
        ];
    },
};

export default withNextIntl(nextConfig);
