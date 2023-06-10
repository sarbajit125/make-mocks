/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    middilewareURL:"http://localhost:8080/",
   output: 'standalone',
  }
}

module.exports = nextConfig
