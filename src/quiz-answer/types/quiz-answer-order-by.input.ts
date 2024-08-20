import { Expose } from 'class-transformer';
import { Field, InputType } from 'type-graphql';
import { BaseOrderByInput } from '../../shared/types/base-order-by.input';
import { OrderBy } from '../../shared/types/order-by';

@InputType()
export class QuizAnswerOrderByInput extends BaseOrderByInput {
  @Field(() => OrderBy, { nullable: true })
  @Expose({ name: 'created_at' })
  createdAt?: OrderBy;

  @Field(() => OrderBy, { nullable: true })
  @Expose({ name: 'seq_at' })
  seqId?: OrderBy;
}
