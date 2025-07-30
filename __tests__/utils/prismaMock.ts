import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset } from "vitest-mock-extended";
import { vi } from "vitest";

// Mock the Prisma client
const prismaMock = mockDeep<PrismaClient>();

// Mock the database connection module
vi.mock("~/database/database.connection", () => ({
  prisma: prismaMock,
}));

// Export the mock for use in tests
export { prismaMock };

// Export a function to reset all mocks between tests
export const resetPrismaMocks = () => {
  mockReset(prismaMock);
};

// Export the mock as the default export for convenience
export default prismaMock;
