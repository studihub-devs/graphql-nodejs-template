import { IntFilter } from '../../core/types/int-filter';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class CourseWhereInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field({ nullable: true })
  categoryFilter?: IntFilter;

  @Field({ nullable: true })
  userId?: number;

  @Field({ nullable: true })
  roleId?: number;

  @Field({ nullable: true })
  teacherId?: number;
}
