import { Field, Int, InputType } from 'type-graphql';
import { Expose } from 'class-transformer';
import { APIMethod } from './api-method.input';

@InputType()
export class APIResourceUpdateInput {
  @Field({ nullable: true })
  nameCode?: string;

  @Field({ nullable: true })
  name?: string;

  @Field(() => Int, { nullable: true })
  resourceId?: number;

  @Field(() => APIMethod, { nullable: true })
  method?: APIMethod;

  @Field({ nullable: true })
  @Expose({ name: 'url_path' })
  urlPath?: string;
}
