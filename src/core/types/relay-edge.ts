import { ObjectType, Field, ClassType, ID } from 'type-graphql';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function RelayEdge<Node>(NodeClass: ClassType<Node>) {
  @ObjectType({ isAbstract: true })
  abstract class EdgeClass {
    @Field(() => NodeClass)
    node: Node;

    @Field(() => ID)
    cursor: string;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return EdgeClass as any;
}
