import { prisma } from "~/database/database.connection.js";
import { BlogPostWithComments } from "~/types/application.js";

export class GetBlogPostByIdUseCase {
  async execute(id: string): Promise<BlogPostWithComments | null> {
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        comments: true,
      },
    });

    if (!post) {
      return null;
    }

    return {
      ...post,
      commentCount: post.comments?.length || 0,
    };
  }
}
