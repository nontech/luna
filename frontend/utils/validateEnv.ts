const requiredEnvs = ["API_URL", "APP_URL"] as const;

export function validateEnv() {
  const missingEnvs = requiredEnvs.filter((env) => !process.env[env]);

  if (missingEnvs.length > 0) {
    throw new Error(
      `Missing required environment variables for ${
        process.env.APP_ENV
      }: ${missingEnvs.join(", ")}`
    );
  }
}
