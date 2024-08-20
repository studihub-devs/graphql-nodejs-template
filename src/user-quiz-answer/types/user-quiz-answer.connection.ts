import Connection from '../../shared/types/connection';
import { ObjectType } from 'type-graphql';
import { UserQuizAnswerArgs } from './user-quiz-answer.args';
import { UserQuizAnswerConnectionAggregate } from './user-quiz-answer.aggregate-connection';

@ObjectType()
export class UserQuizAnswerConnection extends Connection(UserQuizAnswerConnectionAggregate) {
  constructor(args: UserQuizAnswerArgs) {
    super();
    this.aggregate = new UserQuizAnswerConnectionAggregate(args);
  }
}
