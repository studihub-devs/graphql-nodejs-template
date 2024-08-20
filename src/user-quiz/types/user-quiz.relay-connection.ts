import { GraphQLResolveInfo } from 'graphql';
import { ObjectType } from 'type-graphql';

import RelayConnection from '../../core/types/relay-connection';
import { UserQuizEdge } from './user-quiz-edge';

@ObjectType()
export class UserQuizRelayConnection extends RelayConnection(UserQuizEdge) {
  constructor(info: GraphQLResolveInfo) {
    super();
    this.edges = new UserQuizEdge(info);
  }
}
