import { GraphQLResolveInfo } from 'graphql';
import { Context } from '../../core/types/context';
import { ObjectType } from 'type-graphql';

import RelayConnection from '../../core/types/relay-connection';
import { NewsEdge } from './news-edge';

@ObjectType()
export class NewsRelayConnection extends RelayConnection(NewsEdge) {
  constructor(info: GraphQLResolveInfo) {
    super();
    this.edges = new NewsEdge(info);
  }
}
