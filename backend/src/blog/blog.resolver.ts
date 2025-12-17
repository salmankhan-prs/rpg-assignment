import { Resolver, Mutation, Args, Query, Subscription } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { BlogService } from './blog.service';
import { BlogModel } from './models/blog.model';
import { CreateBlogInput } from './dto/blog.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

// PubSub for real-time notifications
// Note: For production/scaling, use Redis PubSub instead
const pubSub = new PubSub();
const BLOG_CREATED = 'blogCreated';

@Resolver(() => BlogModel)
export class BlogResolver {
  constructor(private blogService: BlogService) {}

  @Mutation(() => BlogModel)
  @UseGuards(JwtAuthGuard)
  async createBlog(
    @Args('input') input: CreateBlogInput,
    @CurrentUser() user: { id: string },
  ): Promise<BlogModel> {
    const blog = await this.blogService.create(input, user.id);

    // Publish event for real-time notification to all subscribers
    pubSub.publish(BLOG_CREATED, { blogCreated: blog });

    return blog;
  }

  @Query(() => [BlogModel])
  async blogs(): Promise<BlogModel[]> {
    return this.blogService.findAll();
  }

  @Query(() => BlogModel, { nullable: true })
  async blog(@Args('id') id: string): Promise<BlogModel | null> {
    return this.blogService.findById(id);
  }

  // GraphQL Subscription - clients subscribe to this for real-time updates
  @Subscription(() => BlogModel, {
    description: 'Get notified when a new blog is created',
  })
  blogCreated() {
    return pubSub.asyncIterableIterator(BLOG_CREATED);
  }
}
