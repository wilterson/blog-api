import { prisma } from "~/database/database.connection.js";
import { CreateCommentRequest } from "~/types/application.js";

export class AddCommentToBlogPostUseCase {
  async verifyPostExists(postId: string): Promise<void> {
    try {
      await prisma.blogPost.findUniqueOrThrow({
        where: { id: postId },
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Record to find does not exist")
      ) {
        throw new Error(`Blog post with id ${postId} not found`);
      }

      throw error;
    }
  }

  async execute(postId: string, request: CreateCommentRequest): Promise<void> {
    await this.verifyPostExists(postId);

    await prisma.comment.create({
      data: {
        content: request.content,
        author: request.author,
        postId: postId,
      },
    });
  }
}
