import { Field, InputType, Int } from 'type-graphql';
import { ReactType } from './react-type';

@InputType()
export class CourseReactWhereInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Int, { nullable: true })
  courseId?: number;

  @Field(() => Int, { nullable: true })
  userId?: number;

  @Field(() => Int, { nullable: true })
  deviceId?: number;

  @Field(() => ReactType, { nullable: true })
  reactType?: ReactType;
}
