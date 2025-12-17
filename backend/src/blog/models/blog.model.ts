import { Field, ObjectType, ID } from '@nestjs/graphql';
import { UserModel } from '../../auth/models/auth.model';

@ObjectType()
export class BlogModel {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field()
  authorId: string;

  @Field(() => UserModel, { nullable: true })
  author?: UserModel;

  @Field()
  createdAt: Date;
}

