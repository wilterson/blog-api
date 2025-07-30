import { prisma } from "~/database/database.connection.js";
import { CreateBlogPostRequest, BlogPostSummary } from "~/types/application.js";

export class CreateBlogPostUseCase {
  async execute(request: CreateBlogPostRequest): Promise<BlogPostSummary> {
    const blogPost = await prisma.blogPost.create({
      data: {
        title: request.title,
        slug: request.slug,
        content: request.content,
        author: request.author,
      },
      include: {
        comments: true,
      },
    });

    return {
      id: blogPost.id,
      title: blogPost.title,
      slug: blogPost.slug,
      author: blogPost.author,
      createdAt: blogPost.createdAt,
      updatedAt: blogPost.updatedAt,
      commentCount: blogPost.comments?.length || 0,
    };
  }
}
