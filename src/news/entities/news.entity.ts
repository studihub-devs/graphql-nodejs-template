import { Expose, Type } from 'class-transformer';
import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class News {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field({ nullable: true })
  tags: string;

  @Field({ nullable: true })
  thumbnail: string;

  @Field({ nullable: true })
  @Expose({ name: 'redirect_link' })
  redirectLink: string;

  @Field(() => Int)
  @Expose({ name: 'created_by' })
  createdBy: number;

  @Field()
  @Expose({ name: 'created_at' })
  @Type(() => Date)
  createdAt: string;

  @Field(() => String)
  @Expose({ name: 'hash_tags' })
  hashTags: string;
}
