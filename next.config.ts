import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb' // Suporta imagens em base64 (até 5MB originais)
    }
  }
};

export default nextConfig;
