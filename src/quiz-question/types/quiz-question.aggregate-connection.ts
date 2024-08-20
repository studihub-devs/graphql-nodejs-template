import { ObjectType } from 'type-graphql';
import { QuizQuestionArgs } from './quiz-question.args';

@ObjectType()
export class QuizQuestionConnectionAggregate {
  constructor(public readonly args: QuizQuestionArgs) {}
}
