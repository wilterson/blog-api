import { z } from "zod";

// API Request/Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
  details?: z.ZodError;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Validation Schemas
export const CreateBlogPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  content: z
    .string()
    .min(1, "Content is required")
    .max(10000, "Content too long"),
  author: z
    .string()
    .min(1, "Author name is required")
    .max(100, "Author name too long"),
});

export const CreateCommentSchema = z.object({
  postId: z.string().min(1, "Post ID is required").cuid("Invalid post ID"),
  content: z
    .string()
    .min(1, "Comment content is required")
    .max(1000, "Comment too long"),
  author: z
    .string()
    .min(1, "Author name is required")
    .max(100, "Author name too long"),
});

// HTTP Status Types
export type HttpStatus = 200 | 201 | 400 | 401 | 403 | 404 | 500;

export interface ApiError {
  status: HttpStatus;
  message: string;
  code?: string;
  details?: unknown;
}
