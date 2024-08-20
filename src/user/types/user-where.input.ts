import { InputType, Field, Int } from 'type-graphql';

@InputType()
export class UserWhereInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  isActive?: boolean;
}
