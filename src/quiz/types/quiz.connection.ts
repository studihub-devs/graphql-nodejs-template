import Connection from '../../shared/types/connection';
import { ObjectType } from 'type-graphql';
import { QuizArgs } from './quiz.args';
import { QuizConnectionAggregate } from './quiz.aggregate-connection';

@ObjectType()
export class QuizConnection extends Connection(QuizConnectionAggregate) {
  constructor(args: QuizArgs) {
    super();
    this.aggregate = new QuizConnectionAggregate(args);
  }
}
