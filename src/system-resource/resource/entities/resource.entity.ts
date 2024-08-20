import { Expose, Type } from 'class-transformer';
import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export class Resource {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field({ nullable: true })
  name?: string;

  @Field(() => Int, { nullable: true })
  @Expose({ name: 'created_by' })
  createdBy?: number;

  @Field({ nullable: true })
  @Expose({ name: 'created_at' })
  @Type(() => Date)
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  @Expose({ name: 'updated_at' })
  @Type(() => Date)
  updatedAt?: Date;
}
