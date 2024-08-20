import { ObjectType, Int, Field } from 'type-graphql';

@ObjectType()
export class BatchPayload {
  constructor(count: number) {
    this.count = count;
  }

  @Field(() => Int)
  count: number;
}
