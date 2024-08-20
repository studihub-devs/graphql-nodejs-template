import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class CommonResponse {
  @Field()
  message: string;

  @Field()
  status: number;

  @Field(() => String)
  code: string;
}
