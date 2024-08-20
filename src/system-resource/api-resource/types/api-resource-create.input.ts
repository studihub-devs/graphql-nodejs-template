import { Field, Int, ID, InputType } from 'type-graphql';
import { Expose } from 'class-transformer';
import { APIMethod } from './api-method.input';

@InputType()
export class APIResourceCreateInput {
  @Field()
  nameCode: string;

  @Field()
  name?: string;

  @Field(() => Int)
  resourceId?: number;

  @Field(() => APIMethod, { nullable: true })
  method?: APIMethod;

  @Field({ nullable: true })
  @Expose({ name: 'url_path' })
  urlPath?: string;
}
