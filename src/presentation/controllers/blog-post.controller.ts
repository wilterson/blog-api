import { Request, Response } from "express";
import { CreateBlogPostSchema } from "~/types/api.js";
import { GetAllBlogPostsUseCase } from "~/use-cases/get-all-blog-posts.use-case.js";
import { CreateBlogPostUseCase } from "~/use-cases/create-blog-post.use-case.js";
import { slugify } from "~/utils/slugify";
import { GetBlogPostByIdUseCase } from "~/use-cases/get-blog-post-by-id.use-case";
import { isCuid } from "~/utils/is-cuid.js";

export class BlogPostController {
  private getAllBlogPostsUseCase: GetAllBlogPostsUseCase;
  private getBlogPostByIdUseCase: GetBlogPostByIdUseCase;
  private createBlogPostUseCase: CreateBlogPostUseCase;

  constructor() {
    this.getAllBlogPostsUseCase = new GetAllBlogPostsUseCase();
    this.getBlogPostByIdUseCase = new GetBlogPostByIdUseCase();
    this.createBlogPostUseCase = new CreateBlogPostUseCase();
  }

  // Get all blog posts with comment counts
  async getAllPosts(_req: Request, res: Response): Promise<void> {
    try {
      const posts = await this.getAllBlogPostsUseCase.execute();

      res.json({
        success: true,
        data: posts,
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }

  async getPostById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || !isCuid(id)) {
        res.status(400).json({
          success: false,
          error: "Post ID is required",
        });
        return;
      }

      const post = await this.getBlogPostByIdUseCase.execute(id);

      if (!post) {
        res.status(404).json({
          success: false,
          error: "Blog post not found",
        });
        return;
      }

      res.json({
        success: true,
        data: {
          ...post,
          comments: post.comments,
        },
      });
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }

  // Create a new blog post
  async createPost(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = CreateBlogPostSchema.safeParse(req.body);

      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          error: "Validation failed",
          details: validationResult.error.errors,
        });
        return;
      }

      const { title, content, author } = validationResult.data;
      const post = await this.createBlogPostUseCase.execute({
        title,
        slug: slugify(title),
        content,
        author,
      });

      res.status(201).json({
        success: true,
        message: "Blog post created successfully",
        data: post,
      });
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
}
