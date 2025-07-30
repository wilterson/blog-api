# Blog API

A RESTful API for managing a blogging platform built with TypeScript, Express, Prisma ORM, and PostgreSQL. The project follows Domain-Driven Design (DDD) principles.

## 🏗️ Architecture

This project follows a clean architecture pattern with clear separation of concerns:

```
src/
├── presentation/     # Presentation layer (controllers, routes)
├── use-cases/       # Application layer (business logic, use cases)
├── database/        # Infrastructure layer (database connection)
├── types/           # Shared type definitions
└── utils/           # Shared utilities
```

### Key Features

- **Domain-Driven Design (DDD)**: Clear separation of business logic and infrastructure
- **Prisma ORM**: Type-safe database operations with PostgreSQL
- **RESTful API**: Standard HTTP endpoints following REST principles
- **Input Validation**: Zod schemas for request validation
- **Security**: Helmet, CORS, and rate limiting
- **TypeScript**: Full type safety throughout the application

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or higher)
- Docker
- pnpm

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd blog-api
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your PostgreSQL credentials:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/blog_api?schema=public"
   PORT=3000
   NODE_ENV=development
   ```

4. **Set up the database**

   ```bash
   # Generate Prisma client
   pnpm db:generate

   # Run migrations
   pnpm db:migrate

   # Seed the database with sample data (optional)
   pnpm db:seed
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

The API will be available at `http://localhost:3000`

## 🚀 Postman Collection

You can find the Postman collection in the `__tests__/postman` folder.
Import the collection into Postman and set the environment baseUrl variable to `http://localhost:3000`.

## 📚 API Endpoints

### Blog Posts

#### GET /api/posts

Get all blog posts with comment counts.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Blog Post Title",
      "author": "John Doe",
      "commentCount": 5,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### GET /api/posts/:id

Get a specific blog post with all its comments.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Blog Post Title",
    "content": "Blog post content...",
    "author": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "commentCount": 2,
    "comments": [
      {
        "id": "uuid",
        "content": "Great post!",
        "author": "Jane Doe",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

#### POST /api/posts

Create a new blog post.

**Request Body:**

```json
{
  "title": "New Blog Post",
  "content": "This is the content of the blog post...",
  "author": "John Doe"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "New Blog Post",
    "author": "John Doe",
    "commentCount": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Blog post created successfully"
}
```

#### POST /api/posts/:id/comments

Add a comment to a blog post.

**Request Body:**

```json
{
  "content": "This is a comment",
  "author": "Jane Doe"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Comment added successfully"
}
```

### Health Check

#### GET /api/health

Check the health status of the API.

**Response:**

```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

### Project Structure

```
src/
├── presentation/
│   ├── controllers/       # Express controllers
│   └── routes/           # Express routes
├── use-cases/            # Business logic and use cases
├── database/             # Database connection and configuration
├── types/                # Shared type definitions
└── utils/                # Shared utilities

prisma/
└── schema.prisma         # Database schema
```

## 🧪 Testing

To run tests:

```bash
pnpm test
```

## 🌱 Database Seeding

The project includes a seeding system using Faker.js to generate realistic test data:

### Seed Features

- **10 Blog Posts**: Each with unique titles, content, authors, and slugs
- **Random Comments**: 1-8 comments per post with realistic content
- **Faker.js Integration**: Generates realistic names, content, and data

### Seeding Commands

```bash
# Seed the database with sample data
pnpm db:seed

# Reset database and seed
pnpm db:reset
```

## 📦 Production Deployment

1. **Build the application**

   ```bash
   pnpm build
   ```

2. **Set production environment variables**

   ```bash
   NODE_ENV=production
   DATABASE_URL="postgresql://username:password@host:5432/database?schema=public"
   ```

3. **Start the production server**
   ```bash
   pnpm start
   ```
