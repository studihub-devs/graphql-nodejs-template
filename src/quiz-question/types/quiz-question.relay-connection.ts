import { GraphQLResolveInfo } from 'graphql';
import { ObjectType } from 'type-graphql';

import RelayConnection from '../../core/types/relay-connection';
import { QuizQuestionEdge } from './quiz-question-edge';

@ObjectType()
export class QuizQuestionRelayConnection extends RelayConnection(QuizQuestionEdge) {
  constructor(info: GraphQLResolveInfo) {
    super();
    this.edges = new QuizQuestionEdge(info);
  }
}
