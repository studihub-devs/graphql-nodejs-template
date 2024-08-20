import { InputType, Field, Int } from 'type-graphql';
import { QuizQuestionType } from './quiz-question-type';
import { UpsertQuizAnswerInput } from '../../quiz-answer/types/upsert-quiz-answer.input';

@InputType()
export class UpdateQuizQuestionInput {
  @Field({ nullable: true })
  content?: string;  

  @Field(() => Int, { nullable: true })  
  seqId?: number;

  @Field(() => QuizQuestionType, { nullable: true })
  type?: QuizQuestionType;

  @Field(() => [UpsertQuizAnswerInput], { nullable: true })
  answers?: UpsertQuizAnswerInput[];
}
