import { Field, Float, Int, ObjectType } from 'type-graphql';
import { Expose, Type } from 'class-transformer';
import { UserQuizStatus } from '../types/user-quiz-status';

@ObjectType()
export class UserQuiz {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  @Expose({ name: 'user_id' })
  userId: number;

  @Field(() => Int)
  @Expose({ name: 'quiz_id' })
  quizId: number;

  @Field(() => UserQuizStatus)
  status: UserQuizStatus; 

  @Field({ nullable: true })
  @Expose({ name: 'started_at' })
  @Type(() => Date)
  startedAt: Date;

  @Field(() => Date, { nullable: true })
  @Expose({ name: 'completed_at' })
  @Type(() => Date)
  completedAt?: Date;

  @Field(() => Float, { nullable: true }) 
  score: number

  @Field({ nullable: true })
  @Expose({ name: 'created_at' })
  @Type(() => Date)
  createdAt: Date;

  @Field({ nullable: true })
  @Expose({ name: 'updated_at' })
  @Type(() => Date)
  updatedAt?: Date;
}
