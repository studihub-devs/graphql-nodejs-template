import { ObjectType } from 'type-graphql';
import { QuizAnswerArgs } from './quiz-answer.args';

@ObjectType()
export class QuizAnswerConnectionAggregate {
  constructor(public readonly args: QuizAnswerArgs) {}
}
