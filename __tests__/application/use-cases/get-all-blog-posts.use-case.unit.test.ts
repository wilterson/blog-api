import { describe, it, expect, beforeEach } from "vitest";
import { GetAllBlogPostsUseCase } from "~/use-cases/get-all-blog-posts.use-case";
import { createMockBlogPost, createTestComments } from "../../utils/test-utils";
import { prismaMock } from "../../utils/prismaMock";

describe("GetAllBlogPostsUseCase", () => {
  let useCase: GetAllBlogPostsUseCase;

  beforeEach(() => {
    useCase = new GetAllBlogPostsUseCase();
  });

  describe("execute", () => {
    it("should return all blog posts with comment counts", async () => {
      const mockBlogPosts = [
        createMockBlogPost({
          id: "post-1",
          title: "First Post",
          content: "Content 1",
          comments: createTestComments("post-1", 1),
        }),
        createMockBlogPost({
          id: "post-2",
          title: "Second Post",
          content: "Content 2",
          comments: createTestComments("post-2", 2),
        }),
      ];

      prismaMock.blogPost.findMany.mockResolvedValue(mockBlogPosts);

      const result = await useCase.execute();

      expect(prismaMock.blogPost.findMany).toHaveBeenCalledWith({
        include: {
          comments: true,
        },
      });

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: "post-1",
        title: "First Post",
        author: "Test Author",
        commentCount: 1,
        createdAt: mockBlogPosts[0]!.createdAt,
        updatedAt: mockBlogPosts[0]!.updatedAt,
      });
      expect(result[1]).toEqual({
        id: "post-2",
        title: "Second Post",
        author: "Test Author",
        commentCount: 2,
        createdAt: mockBlogPosts[1]!.createdAt,
        updatedAt: mockBlogPosts[1]!.updatedAt,
      });
    });

    it("should return empty array when no posts exist", async () => {
      prismaMock.blogPost.findMany.mockResolvedValue([]);

      const result = await useCase.execute();

      expect(result).toEqual([]);
      expect(prismaMock.blogPost.findMany).toHaveBeenCalledTimes(1);
    });

    it("should handle database errors", async () => {
      const error = new Error("Database connection failed");
      prismaMock.blogPost.findMany.mockRejectedValue(error);

      await expect(useCase.execute()).rejects.toThrow(
        "Database connection failed"
      );
      expect(prismaMock.blogPost.findMany).toHaveBeenCalledTimes(1);
    });

    it("should handle posts with no comments", async () => {
      const mockBlogPosts = [
        createMockBlogPost({
          id: "post-1",
          title: "Post with no comments",
          content: "Content",
          comments: [],
        }),
      ];

      prismaMock.blogPost.findMany.mockResolvedValue(mockBlogPosts);

      const result = await useCase.execute();

      expect(result[0]!.commentCount).toBe(0);
    });
  });
});
