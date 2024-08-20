import { ObjectType } from 'type-graphql';
import { GraphQLResolveInfo } from 'graphql';
import { EdgeBase } from '../../core/types/edge-base';

@ObjectType()
export class NewsEdge extends EdgeBase {
  constructor(info: GraphQLResolveInfo) {
    super();
  }
}
