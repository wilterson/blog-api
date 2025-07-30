import { beforeAll, afterAll, beforeEach } from "vitest";
import { resetPrismaMocks } from "./utils/prismaMock";

// Import the Prisma mock to ensure it's loaded
import "./utils/prismaMock";

// Reset Prisma mocks before each test
beforeEach(() => {
  resetPrismaMocks();
});

// Global test setup
beforeAll(async () => {
  // Any global setup can go here
});

// Global test cleanup
afterAll(async () => {
  // Any global cleanup can go here
});
