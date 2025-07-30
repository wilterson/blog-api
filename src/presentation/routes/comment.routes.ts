import { Router, Request, Response } from "express";
import { CommentController } from "~/presentation/controllers/comment.controller.js";

export function createCommentRoutes(
  commentController: CommentController
): Router {
  const router = Router();

  // Create a comment for a specific post
  router.post("/:postId/comments", (req: Request, res: Response) =>
    commentController.createComment(req, res)
  );

  return router;
}
