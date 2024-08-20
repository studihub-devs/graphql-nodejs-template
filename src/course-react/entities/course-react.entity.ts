import { Expose, Type } from 'class-transformer';
import { Field, Int, ObjectType } from 'type-graphql';
import { ReactType } from '../types/react-type';

@ObjectType()
export class CourseReact {
  @Field(() => Int)
  id: number;

  @Field(() => Int, { nullable: true })
  @Expose({ name: 'user_id' })
  userId?: number;

  @Field(() => Int, { nullable: true })
  @Expose({ name: 'course_id' })
  courseId?: number;

  @Field(() => Int, { nullable: true })
  @Expose({ name: 'device_id' })
  deviceId?: number;

  @Field(() => ReactType, { nullable: true })
  @Expose({ name: 'react_type' })
  reactType: ReactType;

  @Field(() => Date, { nullable: true })
  @Expose({ name: 'created_at' })
  @Type(() => Date)
  createdAt?: string;
}
