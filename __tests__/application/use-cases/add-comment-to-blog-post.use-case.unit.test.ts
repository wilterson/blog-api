import { describe, it, expect, beforeEach } from "vitest";
import { AddCommentToBlogPostUseCase } from "~/use-cases/add-comment-to-blog-post.use-case";
import { createMockBlogPost, createMockComment } from "../../utils/test-utils";
import { prismaMock } from "../../utils/prismaMock";

describe("AddCommentToBlogPostUseCase", () => {
  let useCase: AddCommentToBlogPostUseCase;

  beforeEach(() => {
    useCase = new AddCommentToBlogPostUseCase();
  });

  describe("execute", () => {
    it("should add comment to existing blog post successfully", async () => {
      const postId = "test-post-id";
      const commentRequest = {
        content: "This is a test comment",
        author: "Test Author",
      };

      const mockBlogPost = createMockBlogPost({ id: postId });
      const mockComment = createMockComment({
        content: commentRequest.content,
        author: commentRequest.author,
        postId,
      });

      prismaMock.blogPost.findUnique.mockResolvedValue(mockBlogPost);
      prismaMock.comment.create.mockResolvedValue(mockComment);

      await useCase.execute(postId, commentRequest);

      expect(prismaMock.blogPost.findUnique).toHaveBeenCalledWith({
        where: { id: postId },
      });

      expect(prismaMock.comment.create).toHaveBeenCalledWith({
        data: {
          content: commentRequest.content,
          author: commentRequest.author,
          postId,
        },
      });
    });

    it("should throw error when blog post not found", async () => {
      const postId = "non-existent-id";
      const commentRequest = {
        content: "This is a test comment",
        author: "Test Author",
      };

      prismaMock.blogPost.findUnique.mockResolvedValue(null);

      await expect(useCase.execute(postId, commentRequest)).rejects.toThrow(
        `Blog post with id ${postId} not found`
      );

      expect(prismaMock.comment.create).not.toHaveBeenCalled();
    });

    it("should handle database errors when finding blog post", async () => {
      const postId = "test-post-id";
      const commentRequest = {
        content: "This is a test comment",
        author: "Test Author",
      };

      const error = new Error("Database connection failed");
      prismaMock.blogPost.findUnique.mockRejectedValue(error);

      await expect(useCase.execute(postId, commentRequest)).rejects.toThrow(
        "Database connection failed"
      );
    });

    it("should handle database errors when creating comment", async () => {
      const postId = "test-post-id";
      const commentRequest = {
        content: "This is a test comment",
        author: "Test Author",
      };

      const mockBlogPost = createMockBlogPost({ id: postId });
      const error = new Error("Failed to create comment");

      prismaMock.blogPost.findUnique.mockResolvedValue(mockBlogPost);
      prismaMock.comment.create.mockRejectedValue(error);

      await expect(useCase.execute(postId, commentRequest)).rejects.toThrow(
        "Failed to create comment"
      );
    });

    it("should handle empty content in comment request", async () => {
      const postId = "test-post-id";
      const commentRequest = {
        content: "",
        author: "Test Author",
      };

      const mockBlogPost = createMockBlogPost({ id: postId });
      const mockComment = createMockComment({
        content: commentRequest.content,
        author: commentRequest.author,
        postId,
      });

      prismaMock.blogPost.findUnique.mockResolvedValue(mockBlogPost);
      prismaMock.comment.create.mockResolvedValue(mockComment);

      await useCase.execute(postId, commentRequest);

      expect(prismaMock.comment.create).toHaveBeenCalledWith({
        data: {
          content: "",
          author: commentRequest.author,
          postId,
        },
      });
    });
  });
});
