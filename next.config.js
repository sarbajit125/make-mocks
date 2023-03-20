/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    middilewareURL:"http://localhost:5000/",
   output: 'standalone',
  }
}

module.exports = nextConfig
