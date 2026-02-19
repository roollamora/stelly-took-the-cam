/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Mark better-sqlite3 as external for server-side
      config.externals = config.externals || []
      config.externals.push('better-sqlite3')
    }
    return config
  }
}

module.exports = nextConfig