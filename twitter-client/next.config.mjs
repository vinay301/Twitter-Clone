/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['avatars.githubusercontent.com',"lh3.googleusercontent.com","twiiter-clone-dev-bucket.s3.ap-south-1.amazonaws.com"],
  },
};

export default nextConfig;
