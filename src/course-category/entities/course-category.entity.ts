import { Field, Int, ObjectType } from 'type-graphql';
import { Expose, Type } from 'class-transformer';

@ObjectType()
export class CourseCategory {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  thumbnail: string;

  @Field()
  @Expose({ name: 'created_at' })
  @Type(() => Date)
  createdAt: Date;
}
