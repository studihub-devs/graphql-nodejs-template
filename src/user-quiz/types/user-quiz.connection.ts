import Connection from '../../shared/types/connection';
import { ObjectType } from 'type-graphql';
import { UserQuizArgs } from './user-quiz.args';
import { UserQuizConnectionAggregate } from './user-quiz.aggregate-connection';

@ObjectType()
export class UserQuizConnection extends Connection(UserQuizConnectionAggregate) {
  constructor(args: UserQuizArgs) {
    super();
    this.aggregate = new UserQuizConnectionAggregate(args);
  }
}
