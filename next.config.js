/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    middilewareURL:"http://localhost:3000/mocks",
   output: 'standalone',
  }
}

module.exports = nextConfig
