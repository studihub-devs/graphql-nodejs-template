import { Field, Int, ObjectType } from 'type-graphql';
import { Expose, Type } from 'class-transformer';
import { QuizStatus } from '../types/quiz-status';

@ObjectType()
export class Quiz {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => Int, { nullable: true })
  @Expose({ name: 'course_content_id' })
  courseContentId: number;

  @Field(() => Int, { nullable: true })
  duration: number;

  @Field(() => Boolean, { nullable: true })
  isOptional: boolean;

  @Field(() => QuizStatus, { nullable: true })
  status?: QuizStatus;

  @Field()
  @Expose({ name: 'from_time' })
  @Type(() => Date)
  fromTime: Date;

  @Field(() => Date, { nullable: true })
  @Expose({ name: 'to_time' })
  @Type(() => Date)
  toTime?: Date;

  @Field({ nullable: true })
  @Expose({ name: 'created_at' })
  @Type(() => Date)
  createdAt: Date;

  @Field({ nullable: true })
  @Expose({ name: 'updated_at' })
  @Type(() => Date)
  updatedAt?: Date;
}
