import { InputType, Field, Int } from 'type-graphql';

@InputType()
export class CreateUserCourseInput {
  @Field(() => Int)
  courseId: number;
}
