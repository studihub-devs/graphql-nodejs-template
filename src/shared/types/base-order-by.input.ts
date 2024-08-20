import { Field, InputType } from 'type-graphql';
import { OrderBy } from './order-by';

@InputType()
export class BaseOrderByInput {
  @Field(() => OrderBy, { nullable: true })
  id: OrderBy;
}
