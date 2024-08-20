import { Field, Float, Int, ObjectType } from 'type-graphql';
import { Expose, Type } from 'class-transformer';

@ObjectType()
export class UserQuizAnswer {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  @Expose({ name: 'user_quiz_id' })
  userQuizId: number;

  @Field(() => Int)
  @Expose({ name: 'question_id' })
  questionId: number;

  @Field(() => [Int], { nullable: true })  
  answers: number[];

  @Field(() => Boolean, { nullable: true })
  isCorrect: boolean; 

  @Field(() => Float, { nullable: true })
  score: number; 
  
  @Field({ nullable: true })
  @Expose({ name: 'created_at' })
  @Type(() => Date)
  createdAt: Date;

  @Field({ nullable: true })
  @Expose({ name: 'updated_at' })
  @Type(() => Date)
  updatedAt?: Date;
}
