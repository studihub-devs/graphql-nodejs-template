import Connection from '../../shared/types/connection';
import { ObjectType } from 'type-graphql';
import { QuizQuestionArgs } from './quiz-question.args';
import { QuizQuestionConnectionAggregate } from './quiz-question.aggregate-connection';

@ObjectType()
export class QuizQuestionConnection extends Connection(
  QuizQuestionConnectionAggregate,
) {
  constructor(args: QuizQuestionArgs) {
    super();
    this.aggregate = new QuizQuestionConnectionAggregate(args);
  }
}
