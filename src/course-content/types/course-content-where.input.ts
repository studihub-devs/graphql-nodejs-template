import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class CourseContentWhereInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => [Int], { nullable: true })
  ids?: number[];

  @Field(() => Int, { nullable: true })
  courseId?: number;

  @Field(() => Int, { nullable: true })
  parentId?: number;

  @Field(() => Int, { nullable: true })
  userId?: number;

  @Field(() => Int, { nullable: true })
  roleId?: number;

  @Field({ nullable: true })
  title?: string;
}
