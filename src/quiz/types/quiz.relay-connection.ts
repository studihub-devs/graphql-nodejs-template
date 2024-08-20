import { GraphQLResolveInfo } from 'graphql';
import { ObjectType } from 'type-graphql';

import RelayConnection from '../../core/types/relay-connection';
import { QuizEdge } from './quiz-edge';


@ObjectType()
export class QuizRelayConnection extends RelayConnection(QuizEdge) {
  constructor(info: GraphQLResolveInfo) {
    super();
    this.edges = new QuizEdge(info);
  }
}
