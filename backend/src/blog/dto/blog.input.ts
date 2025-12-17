import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class CreateBlogInput {
  @Field()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @Field()
  @IsNotEmpty()
  content: string;
}

