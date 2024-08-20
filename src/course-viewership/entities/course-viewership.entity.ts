import { Expose, Type } from 'class-transformer';
import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class CourseViewership {
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

  @Field(() => Int, { defaultValue: 1 })
  @Expose({ name: 'power' })
  power: number;

  @Field(() => Date, { nullable: true })
  @Expose({ name: 'created_at' })
  @Type(() => Date)
  createdAt?: string;
}
