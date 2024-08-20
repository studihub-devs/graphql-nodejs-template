import { GraphQLResolveInfo } from 'graphql';
import { ObjectType } from 'type-graphql';

import RelayConnection from '../../core/types/relay-connection';
import { UserQuizAnswerEdge } from './user-quiz-answer-edge';

@ObjectType()
export class UserQuizAnswerRelayConnection extends RelayConnection(UserQuizAnswerEdge) {
  constructor(info: GraphQLResolveInfo) {
    super();
    this.edges = new UserQuizAnswerEdge(info);
  }
}
