import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { slugify } from "../src/utils/slugify.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  await prisma.comment.deleteMany();
  await prisma.blogPost.deleteMany();

  console.log("🗑️  Cleared existing data");

  const postsData = Array.from({ length: 10 }, () => {
    const title = faker.lorem.sentence({ min: 3, max: 8 });
    return {
      title,
      content: faker.lorem.paragraphs({ min: 2, max: 5 }),
      author: faker.person.fullName(),
      slug: slugify(title),
    };
  });

  // Create all posts
  const posts = await prisma.blogPost.createMany({
    data: postsData,
  });

  console.log(`📝 Created ${posts.count} posts`);

  const createdPosts = await prisma.blogPost.findMany({
    select: { id: true, title: true },
  });

  // Generate comments data for all posts
  const commentsData = createdPosts.flatMap((post) => {
    const commentCount = faker.number.int({ min: 1, max: 8 });
    return Array.from({ length: commentCount }, () => ({
      content: faker.lorem.paragraph({ min: 1, max: 3 }),
      author: faker.person.fullName(),
      postId: post.id,
    }));
  });

  // Create all comments at once
  const comments = await prisma.comment.createMany({
    data: commentsData,
  });

  console.log(`💬 Created ${comments.count} comments across all posts`);

  console.log("✅ Database seeded successfully!");
  console.log(
    `📊 Created ${posts.count} posts with ${comments.count} total comments`
  );
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
