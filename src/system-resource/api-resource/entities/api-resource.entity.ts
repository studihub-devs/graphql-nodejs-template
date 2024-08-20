import { Expose, Type } from 'class-transformer';
import { ObjectType, Field, Int } from 'type-graphql';
import { APIMethod } from '../types/api-method.input';

@ObjectType()
export class APIResource {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  @Expose({ name: 'name_code' })
  nameCode: string;

  @Field({ nullable: true })
  name: string;

  @Field(() => Int, { nullable: true })
  @Expose({ name: 'resource_id' })
  resourceId?: number;

  @Field(() => APIMethod, { nullable: true })
  method?: APIMethod;

  @Field({ nullable: true })
  @Expose({ name: 'url_path' })
  urlPath?: string;

  @Field(() => Int, { nullable: true })
  @Expose({ name: 'created_by' })
  createdBy: number;

  @Field({ nullable: true })
  @Expose({ name: 'created_at' })
  @Type(() => Date)
  createdAt: Date;

  @Field({ nullable: true })
  @Expose({ name: 'updated_at' })
  @Type(() => Date)
  updatedAt: Date;
}
