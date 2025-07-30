import { vi } from "vitest";
import { BlogPost, Comment } from "@prisma/client";

export const createMockBlogPost = (
  overrides: Partial<BlogPost & { comments?: Comment[] }> = {}
): BlogPost & { comments?: Comment[] } => ({
  id: "test-post-id",
  title: "Test Blog Post",
  content: "This is a test blog post content.",
  author: "Test Author",
  createdAt: new Date("2024-01-01T00:00:00Z"),
  updatedAt: new Date("2024-01-01T00:00:00Z"),
  ...overrides,
});

export const createMockComment = (
  overrides: Partial<Comment> = {}
): Comment => ({
  id: "test-comment-id",
  content: "This is a test comment.",
  author: "Test Author",
  postId: "test-post-id",
  createdAt: new Date("2024-01-01T00:00:00Z"),
  ...overrides,
});

export const createTestComments = (
  postId: string,
  count: number = 2
): Comment[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: `comment-${index + 1}`,
    content: `Test comment ${index + 1}`,
    author: `Author ${index + 1}`,
    postId,
    createdAt: new Date("2024-01-01T00:00:00Z"),
  }));
};

export const createMockPrismaClient = () => ({
  blogPost: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  comment: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  $disconnect: vi.fn(),
});
