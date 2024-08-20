import { GraphQLResolveInfo } from 'graphql';
import { ObjectType } from 'type-graphql';

import RelayConnection from '../../core/types/relay-connection';
import { QuizAnswerEdge } from './quiz-answer-edge';

@ObjectType()
export class QuizAnswerRelayConnection extends RelayConnection(QuizAnswerEdge) {
  constructor(info: GraphQLResolveInfo) {
    super();
    this.edges = new QuizAnswerEdge(info);
  }
}
