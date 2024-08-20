import { Expose } from 'class-transformer';
import { Field, InputType, Int } from 'type-graphql';
import { BaseOrderByInput } from '../../shared/types/base-order-by.input';
import { OrderBy } from '../../shared/types/order-by';

@InputType()
export class CourseContentOrderByInput extends BaseOrderByInput {
  @Field(() => OrderBy, { nullable: true })
  @Expose({ name: 'created_at' })
  createdAt?: OrderBy;

  @Field(() => OrderBy, { nullable: true })
  @Expose({ name: 'seq_id' })
  seqId?: OrderBy;
}
