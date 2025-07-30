import { describe, it, expect, beforeEach } from "vitest";
import { GetBlogPostByIdUseCase } from "~/use-cases/get-blog-post-by-id.use-case";
import { createMockBlogPost, createTestComments } from "../../utils/test-utils";
import { prismaMock } from "../../utils/prismaMock";

describe("GetBlogPostByIdUseCase", () => {
  let useCase: GetBlogPostByIdUseCase;

  beforeEach(() => {
    useCase = new GetBlogPostByIdUseCase();
  });

  describe("execute", () => {
    it("should return blog post with comments when found", async () => {
      const postId = "test-post-id";
      const mockComments = createTestComments(postId, 2);
      const mockBlogPost = createMockBlogPost({
        id: postId,
        title: "Test Post",
        content: "Test content",
        comments: mockComments,
      });

      prismaMock.blogPost.findUnique.mockResolvedValue(mockBlogPost);

      const result = await useCase.execute(postId);

      expect(prismaMock.blogPost.findUnique).toHaveBeenCalledWith({
        where: { id: postId },
        include: {
          comments: true,
        },
      });

      expect(result).toEqual({
        id: postId,
        title: "Test Post",
        content: "Test content",
        author: "Test Author",
        createdAt: mockBlogPost.createdAt,
        updatedAt: mockBlogPost.updatedAt,
        commentCount: 2,
        comments: mockComments,
      });
    });

    it("should return null when blog post not found", async () => {
      const postId = "non-existent-id";
      prismaMock.blogPost.findUnique.mockResolvedValue(null);

      const result = await useCase.execute(postId);

      expect(result).toBeNull();
      expect(prismaMock.blogPost.findUnique).toHaveBeenCalledTimes(1);
    });

    it("should handle blog post without comments", async () => {
      const postId = "test-post-id";
      const mockBlogPost = createMockBlogPost({
        id: postId,
        title: "Test Post",
        content: "Test content",
        comments: [],
      });

      prismaMock.blogPost.findUnique.mockResolvedValue(mockBlogPost);

      const result = await useCase.execute(postId);

      expect(result!.commentCount).toBe(0);
      expect(result!.comments).toEqual([]);
    });

    it("should handle database errors", async () => {
      const postId = "test-post-id";
      const error = new Error("Database connection failed");
      prismaMock.blogPost.findUnique.mockRejectedValue(error);

      await expect(useCase.execute(postId)).rejects.toThrow(
        "Database connection failed"
      );
      expect(prismaMock.blogPost.findUnique).toHaveBeenCalledTimes(1);
    });
  });
});
