import { IntFilter } from '../../core/types/int-filter';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class CourseCategoryWhereInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field({ nullable: true })
  parentIdFilter?: IntFilter;

  @Field({ nullable: true })
  name?: string;
}
