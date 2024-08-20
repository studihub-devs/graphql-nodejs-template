import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class CreateCourseReviewInput {
  @Field(() => Int)
  courseId: number;

  @Field(() => Int)
  rate: number;

  @Field(() => String, { nullable: true })
  content?: string;
}
