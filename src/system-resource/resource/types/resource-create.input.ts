import { Field, InputType } from 'type-graphql';

@InputType()
export class ResourceCreateInput {
  @Field()
  name: string;
}
