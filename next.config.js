/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  env: {
    middilewareURL:"http://localhost:8080/",
  }
}

module.exports = nextConfig
