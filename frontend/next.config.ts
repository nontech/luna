import type { NextConfig } from "next";

const loadEnvConfig = () => {
  switch (process.env.APP_ENV) {
    case "docker":
      return { envFilePath: ".env.docker" };
    case "test":
      return { envFilePath: ".env.test" };
    case "production":
      return { envFilePath: ".env.production" };
    default:
      return { envFilePath: ".env.local" };
  }
};

const nextConfig: NextConfig = {
  ...loadEnvConfig(),
};

export default nextConfig;
