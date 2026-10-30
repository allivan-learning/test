import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },
  reactCompiler: true,
};

export default nextConfig;
