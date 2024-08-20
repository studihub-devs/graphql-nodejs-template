import Connection from '../../shared/types/connection';
import { ObjectType } from 'type-graphql';
import { QuizAnswerArgs } from './quiz-answer.args';
import { QuizAnswerConnectionAggregate } from './quiz-answer.aggregate-connection';

@ObjectType()
export class QuizAnswerConnection extends Connection(
  QuizAnswerConnectionAggregate,
) {
  constructor(args: QuizAnswerArgs) {
    super();
    this.aggregate = new QuizAnswerConnectionAggregate(args);
  }
}
