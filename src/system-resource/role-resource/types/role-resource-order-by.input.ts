import { Field, InputType } from 'type-graphql';
import { OrderBy } from '../../../shared/types/order-by';
import { BaseOrderByInput } from '../../../shared/types/base-order-by.input';
import { Expose } from 'class-transformer';

@InputType()
export class RoleResourceOrderByInput extends BaseOrderByInput {
  @Field(() => OrderBy, { nullable: true })
  @Expose({ name: 'updated_at' })
  updatedAt?: OrderBy;
}
