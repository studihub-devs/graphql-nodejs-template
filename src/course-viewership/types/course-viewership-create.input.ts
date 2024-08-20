import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class CreateCourseViewershipInput {
  @Field(() => Int)
  courseId: number;

  @Field(() => Int, { defaultValue: 1 })
  power: number;

  @Field(() => Int, { nullable: true })
  deviceId?: number;
}
