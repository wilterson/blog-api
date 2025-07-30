import { BlogPost, Comment } from "@prisma/client";

// BlogPost Application Types
export interface CreateBlogPostRequest {
  title: string;
  slug: string;
  content: string;
  author: string;
}

export interface CreateCommentRequest {
  content: string;
  author: string;
}

export type BlogPostWithComments = BlogPost & {
  comments: Comment[];
  commentCount: number;
};

export type BlogPostSummary = Pick<
  BlogPost,
  "id" | "title" | "slug" | "author" | "createdAt" | "updatedAt"
> & {
  commentCount: number;
};
