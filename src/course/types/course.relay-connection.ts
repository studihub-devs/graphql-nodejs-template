import { GraphQLResolveInfo } from 'graphql';
import { Context } from '../../core/types/context';
import { ObjectType } from 'type-graphql';

import RelayConnection from '../../core/types/relay-connection';
import { CourseEdge } from './course-edge';

@ObjectType()
export class CourseRelayConnection extends RelayConnection(CourseEdge) {
  constructor(info: GraphQLResolveInfo) {
    super();
    this.edges = new CourseEdge(info);
  }
}
