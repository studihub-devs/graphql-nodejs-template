import { ObjectType, Field, ClassType, Int } from 'type-graphql';

import { PageInfo } from './page-info';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function RelayConnection<Edge>(EdgeClass: ClassType<Edge>) {
  @ObjectType({ isAbstract: true })
  abstract class ConnectionClass {
    @Field(() => [EdgeClass])
    edges: Edge[];

    @Field(() => PageInfo)
    pageInfo: PageInfo;

    @Field(() => Int)
    totalCount: number;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ConnectionClass as any;
}
