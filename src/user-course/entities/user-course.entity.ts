import { Int, Field, ObjectType } from 'type-graphql';
import { Expose, Type } from 'class-transformer';

@ObjectType()
export class UserCourse {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  @Expose({ name: 'user_id' })
  userId?: number;

  @Field(() => Int, { nullable: true })
  @Expose({ name: 'course_id' })
  courseId?: number;

  @Field({ nullable: true })
  @Expose({ name: 'joinning_time' })
  @Type(() => Date)
  joinningTime: Date;
}
