import { InputType, Field, Int } from 'type-graphql';
import { QuizQuestionType } from './quiz-question-type';
import { UpsertQuizAnswerInput } from '../../quiz-answer/types/upsert-quiz-answer.input';

@InputType()
export class InsertQuizQuestionInput {
  @Field()
  content: string;

  @Field(() => Int)  
  quizId: number;

  @Field(() => Int, { nullable: true })  
  seqId: number;

  @Field(() => QuizQuestionType)
  type: QuizQuestionType;

  @Field(() => [UpsertQuizAnswerInput], { nullable: true })
  answers?: UpsertQuizAnswerInput[];
}
