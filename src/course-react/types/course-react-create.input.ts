import { Field, InputType, Int } from 'type-graphql';
import { ReactType } from './react-type';

@InputType()
export class CreateCourseReactInput {
  @Field(() => Int)
  courseId: number;

  @Field(() => ReactType)
  reactType: ReactType;

  @Field(() => Int, { nullable: true })
  deviceId?: number;
}
