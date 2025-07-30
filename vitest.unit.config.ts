import { defineConfig } from "vitest/config";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: "node",
    include: ["__tests__/**/*.unit.test.ts", "__tests__/**/*.unit.spec.ts"],
    exclude: ["**/node_modules/**", "**/dist/**"],
    setupFiles: ["./__tests__/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "dist/",
        "**/*.config.ts",
        "**/*.d.ts",
        "**/__tests__/**",
      ],
    },
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
      "~/types": path.resolve(__dirname, "./src/types"),
      "~/use-cases": path.resolve(__dirname, "./src/use-cases"),
      "~/presentation": path.resolve(__dirname, "./src/presentation"),
      "~/database": path.resolve(__dirname, "./src/database"),
      "~/tests/utils": path.resolve(__dirname, "./__tests__/utils"),
    },
  },
});
