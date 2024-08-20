import { Expose } from 'class-transformer';
import { Field, InputType } from 'type-graphql';
import { OrderBy } from '../../../shared/types/order-by';
import { BaseOrderByInput } from '../../../shared/types/base-order-by.input';

@InputType()
export class APIResourceOrderByInput extends BaseOrderByInput {
  @Field(() => OrderBy, { nullable: true })
  @Expose({ name: 'created_at' })
  createdAt?: OrderBy;
}
