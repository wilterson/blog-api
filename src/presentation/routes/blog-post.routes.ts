import { Router, Request, Response } from "express";
import { BlogPostController } from "~/presentation/controllers/blog-post.controller.js";

export function createBlogPostRoutes(
  blogPostController: BlogPostController
): Router {
  const router = Router();

  // Get all posts
  router.get("/", (req: Request, res: Response) =>
    blogPostController.getAllPosts(req, res)
  );

  // Single route that handles both
  router.get("/:id", (req: Request, res: Response) => {
    blogPostController.getPostById(req, res);
  });

  // Create a new post
  router.post("/", (req: Request, res: Response) =>
    blogPostController.createPost(req, res)
  );

  return router;
}
