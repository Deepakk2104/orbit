import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    env: {
      NODE_ENV: "test",
      PORT: "5001",
      DATABASE_URL:
        process.env.TEST_DATABASE_URL ??
        "postgresql://postgres:2104@localhost:5432/orbit_test?schema=public",
      JWT_ACCESS_SECRET: "test_access_secret",
      JWT_REFRESH_SECRET: "test_refresh_secret",
      ACCESS_TOKEN_EXPIRES_IN: "15m",
      REFRESH_TOKEN_EXPIRES_IN: "7d",
      CLIENT_URL: "http://localhost:3000",
      AUTH_RATE_LIMIT: "10000",
    },
    fileParallelism: false,
    sequence: {
      concurrent: false,
    },
    pool: "forks",
    maxWorkers: 1,
  },
});
