import { prisma } from "~/database/database.connection.js";
import { BlogPostSummary } from "~/types/application.js";

export class GetAllBlogPostsUseCase {
  async execute(): Promise<BlogPostSummary[]> {
    const posts = await prisma.blogPost.findMany({
      include: {
        comments: true,
      },
    });

    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      author: post.author,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      commentCount: post.comments?.length || 0,
    }));
  }
}
