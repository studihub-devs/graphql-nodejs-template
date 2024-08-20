import { Field, InputType, Int } from 'type-graphql';
import { StringFilter } from '../../../core/types/string-filter';

@InputType()
export class RolesWhereInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field({ nullable: true })
  name?: StringFilter;

  @Field(() => String, { nullable: true })
  createdUser?: StringFilter;
}
