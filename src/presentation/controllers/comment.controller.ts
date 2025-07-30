import { Request, Response } from "express";
import { CreateCommentSchema } from "~/types/api.js";
import { AddCommentToBlogPostUseCase } from "~/use-cases/add-comment-to-blog-post.use-case.js";

export class CommentController {
  private addCommentToBlogPostUseCase: AddCommentToBlogPostUseCase;

  constructor() {
    this.addCommentToBlogPostUseCase = new AddCommentToBlogPostUseCase();
  }

  /**
   * Add a comment to a blog post
   */
  async createComment(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.body;

      if (!postId) {
        res.status(400).json({
          success: false,
          error: "Post ID is required",
        });
        return;
      }

      const validationResult = CreateCommentSchema.safeParse(req.body);

      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          error: "Validation failed",
          details: validationResult.error.errors,
        });
        return;
      }

      const { content, author } = validationResult.data;
      await this.addCommentToBlogPostUseCase.execute(postId, {
        content,
        author,
      });

      res.status(201).json({
        success: true,
        message: "Comment added successfully",
      });
    } catch (error) {
      console.error("Error adding comment:", error);

      if (error instanceof Error && error.message.includes("not found")) {
        res.status(404).json({
          success: false,
          error: error.message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
}
