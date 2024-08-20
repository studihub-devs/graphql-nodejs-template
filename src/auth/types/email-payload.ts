import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class EmailPayload {
  @Field()
  email: string;
}
