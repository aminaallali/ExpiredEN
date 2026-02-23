import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Required for Fly.io Dockerfile — generates a standalone Node.js server
  output: 'standalone',

  // Security headers
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
      ],
    },
  ],

  // Prevent accidental exposure of server env vars
  serverExternalPackages: [],
}

export default nextConfig
