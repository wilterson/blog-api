import { describe, it, expect, beforeEach } from "vitest";
import { CreateBlogPostUseCase } from "~/use-cases/create-blog-post.use-case.js";
import { createMockBlogPost, createTestComments } from "../../utils/test-utils";
import { prismaMock } from "../../utils/prismaMock";

describe("CreateBlogPostUseCase", () => {
  let useCase: CreateBlogPostUseCase;

  beforeEach(() => {
    useCase = new CreateBlogPostUseCase();
  });

  describe("execute", () => {
    it("should create a blog post successfully", async () => {
      const request = {
        title: "Test Blog Post",
        content: "This is a test blog post content.",
        author: "Test Author",
      };

      const mockBlogPost = createMockBlogPost({
        title: request.title,
        content: request.content,
        author: request.author,
        comments: [],
      });

      prismaMock.blogPost.create.mockResolvedValue(mockBlogPost);

      const result = await useCase.execute(request);

      expect(prismaMock.blogPost.create).toHaveBeenCalledWith({
        data: {
          title: request.title,
          content: request.content,
          author: request.author,
        },
        include: {
          comments: true,
        },
      });

      expect(result).toEqual({
        id: mockBlogPost.id,
        title: mockBlogPost.title,
        author: mockBlogPost.author,
        commentCount: 0,
        createdAt: mockBlogPost.createdAt,
        updatedAt: mockBlogPost.updatedAt,
      });
    });

    it("should handle blog post with comments", async () => {
      const request = {
        title: "Test Blog Post",
        content: "This is a test blog post content.",
        author: "Test Author",
      };

      const mockComments = createTestComments("test-post-id", 2);
      const mockBlogPost = createMockBlogPost({
        title: request.title,
        content: request.content,
        author: request.author,
        comments: mockComments,
      });

      prismaMock.blogPost.create.mockResolvedValue(mockBlogPost);

      const result = await useCase.execute(request);

      expect(result.commentCount).toBe(2);
      expect(prismaMock.blogPost.create).toHaveBeenCalledTimes(1);
    });

    it("should handle database errors", async () => {
      const request = {
        title: "Test Blog Post",
        content: "This is a test blog post content.",
        author: "Test Author",
      };

      const error = new Error("Database connection failed");
      prismaMock.blogPost.create.mockRejectedValue(error);

      await expect(useCase.execute(request)).rejects.toThrow(
        "Database connection failed"
      );
      expect(prismaMock.blogPost.create).toHaveBeenCalledTimes(1);
    });

    it("should handle empty comments array", async () => {
      const request = {
        title: "Test Blog Post",
        content: "This is a test blog post content.",
        author: "Test Author",
      };

      const mockBlogPost = createMockBlogPost({
        title: request.title,
        content: request.content,
        author: request.author,
        comments: [], // Test empty comments array
      });

      prismaMock.blogPost.create.mockResolvedValue(mockBlogPost);

      const result = await useCase.execute(request);

      expect(result.commentCount).toBe(0);
    });
  });
});
