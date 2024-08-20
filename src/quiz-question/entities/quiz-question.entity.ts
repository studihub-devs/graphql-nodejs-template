import { Field, Int, ObjectType } from 'type-graphql';
import { Expose, Type } from 'class-transformer';
import { QuizQuestionType } from '../types/quiz-question-type';

@ObjectType()
export class QuizQuestion {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  content: string;

  @Field(() => Int, { nullable: true })
  @Expose({ name: 'quiz_id' })
  quizId: number;

  @Field(() => Int, { nullable: true })
  @Expose({ name: 'seq_id' })
  seqId: number;

  @Field(() => QuizQuestionType, { nullable: true })
  type: QuizQuestionType;

  @Field()
  @Expose({ name: 'created_at' })
  @Type(() => Date)
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  @Expose({ name: 'updated_at' })
  @Type(() => Date)
  updatedAt?: Date;
}
