/** @type {import('next').NextConfig} */
const nextConfig = {

    images: {
        // unoptimized: true,
        remotePatterns: [
            {

                hostname: 'res.cloudinary.com',

            },
        ]
    }
};


export default nextConfig;
