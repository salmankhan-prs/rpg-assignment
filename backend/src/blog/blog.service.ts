import { Injectable } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { DrizzleService } from '../drizzle/drizzle.service';
import { blogs, users } from '../drizzle/schema';
import { CreateBlogInput } from './dto/blog.input';

@Injectable()
export class BlogService {
  constructor(private drizzle: DrizzleService) {}

  async create(input: CreateBlogInput, authorId: string) {
    const [newBlog] = await this.drizzle.db
      .insert(blogs)
      .values({
        title: input.title,
        content: input.content,
        authorId,
      })
      .returning();

    // Get author details for the response
    const [author] = await this.drizzle.db
      .select()
      .from(users)
      .where(eq(users.id, authorId))
      .limit(1);

    return {
      ...newBlog,
      author: author
        ? {
            id: author.id,
            email: author.email,
            name: author.name,
            createdAt: author.createdAt,
          }
        : undefined,
    };
  }

  async findAll() {
    const result = await this.drizzle.db
      .select({
        blog: blogs,
        author: {
          id: users.id,
          email: users.email,
          name: users.name,
          createdAt: users.createdAt,
        },
      })
      .from(blogs)
      .leftJoin(users, eq(blogs.authorId, users.id))
      .orderBy(desc(blogs.createdAt));

    return result.map((row) => ({
      ...row.blog,
      author: row.author || undefined,
    }));
  }

  async findById(id: string) {
    const [result] = await this.drizzle.db
      .select({
        blog: blogs,
        author: {
          id: users.id,
          email: users.email,
          name: users.name,
          createdAt: users.createdAt,
        },
      })
      .from(blogs)
      .leftJoin(users, eq(blogs.authorId, users.id))
      .where(eq(blogs.id, id))
      .limit(1);

    if (!result) return null;

    return {
      ...result.blog,
      author: result.author || undefined,
    };
  }
}

