import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class CourseAttachFileWhereInput {
  @Field(() => Int, { nullable: true })
  id?: number;
}
