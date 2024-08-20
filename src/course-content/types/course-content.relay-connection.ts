import { GraphQLResolveInfo } from 'graphql';
import { ObjectType } from 'type-graphql';

import RelayConnection from '../../core/types/relay-connection';
import { CourseContentEdge } from './course-content-edge';

@ObjectType()
export class CourseContentRelayConnection extends RelayConnection(CourseContentEdge) {
  constructor(info: GraphQLResolveInfo) {
    super();
    this.edges = new CourseContentEdge(info);
  }
}
