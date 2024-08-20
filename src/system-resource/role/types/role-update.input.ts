import { Field, InputType } from 'type-graphql';
import { ResourceInput } from './resource.input';

@InputType()
export class RolesUpdateInput {
  @Field({ nullable: true })
  name: string;

  @Field(() => [ResourceInput], { nullable: true })
  resources: ResourceInput[];
}
