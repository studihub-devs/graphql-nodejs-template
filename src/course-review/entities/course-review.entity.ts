import { Expose, Type } from 'class-transformer';
import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class CourseReview {
  @Field(() => Int)
  id: number;

  @Field(() => Int, { nullable: true })
  @Expose({ name: 'user_id' })
  userId?: number;

  @Field(() => Int, { nullable: true })
  @Expose({ name: 'course_id' })
  courseId?: number;

  @Field(() => Int, { nullable: true })
  @Expose({ name: 'rate' })
  rate?: number;

  @Field({ nullable: true })
  content?: string;

  @Field(() => Date, { nullable: true })
  @Expose({ name: 'created_at' })
  @Type(() => Date)
  createdAt?: string;
}
