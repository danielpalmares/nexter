import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: ['./sass'],
    silenceDeprecations: ['import', 'legacy-js-api'],
  },
};

export default nextConfig;
