/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    middilewareURL:"http://localhost:3000/mocks",
    clientName: "ADG"
  }
}

module.exports = nextConfig
