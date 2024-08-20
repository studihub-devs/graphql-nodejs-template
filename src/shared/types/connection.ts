import { ObjectType, Field, ClassType } from 'type-graphql';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function Connection<TAggregate>(
  TAggregateClass: ClassType<TAggregate>,
) {
  @ObjectType({ isAbstract: true })
  abstract class ConnectionClass {
    @Field(() => TAggregateClass)
    aggregate: TAggregate;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ConnectionClass as any;
}
