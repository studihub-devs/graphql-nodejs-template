import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class CourseViewershipWhereInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Int, { nullable: true })
  courseId?: number;

  @Field(() => Int, { nullable: true })
  userId?: number;

  @Field(() => Int, { nullable: true })
  deviceId?: number;

  @Field(() => Int, { nullable: true, defaultValue: 1 })
  power?: number;
}
