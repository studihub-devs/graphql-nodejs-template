import { Expose } from 'class-transformer';
import { Field, InputType } from 'type-graphql';

import { BaseOrderByInput } from '../../../shared/types/base-order-by.input';
import { OrderBy } from '../../../shared/types/order-by';

@InputType()
export class ResourceOrderByInput extends BaseOrderByInput {
  @Field(() => OrderBy, { nullable: true })
  @Expose({ name: 'id' })
  createdAt?: OrderBy;
}
