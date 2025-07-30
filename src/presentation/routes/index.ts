import { Router } from "express";
import { createBlogPostRoutes } from "./blog-post.routes.js";
import { createCommentRoutes } from "./comment.routes.js";
import { BlogPostController } from "~/presentation/controllers/blog-post.controller.js";
import { CommentController } from "~/presentation/controllers/comment.controller.js";

export function createApiRouter(
  blogPostController: BlogPostController,
  commentController: CommentController
): Router {
  const router = Router();

  // Health Check
  router.get("/health", (_req, res) => {
    res.json({
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  router.use("/posts", createBlogPostRoutes(blogPostController));
  router.use("/posts", createCommentRoutes(commentController));

  return router;
}
