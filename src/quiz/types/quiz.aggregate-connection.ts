import { ObjectType } from 'type-graphql';
import { QuizArgs } from './quiz.args';

@ObjectType()
export class QuizConnectionAggregate {
  constructor(public readonly args: QuizArgs) {}
}
