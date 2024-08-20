import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class CourseReviewWhereInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Int, { nullable: true })
  courseId?: number;

  @Field(() => Int, { nullable: true })
  userId?: number;

  @Field(() => Int, { nullable: true })
  rate?: number;

  @Field(() => String, { nullable: true })
  content?: string;
}
