import { Field, InputType, Int } from 'type-graphql';
import { ResourceInput } from './resource.input';

@InputType()
export class RoleCreateInput {
  @Field()
  name: string;

  @Field(() => [ResourceInput])
  resources: ResourceInput[];
}
