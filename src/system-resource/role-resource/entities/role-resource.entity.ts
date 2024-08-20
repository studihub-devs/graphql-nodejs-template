import { Field, Int, ObjectType } from 'type-graphql';
import { Expose, Type } from 'class-transformer';

@ObjectType()
export class RoleResource {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Int, { nullable: true })
  @Expose({ name: 'role_id' })
  roleId?: number;

  @Field(() => Int, { nullable: true })
  @Expose({ name: 'resource_id' })
  resourceId: number;

  @Field(() => Int, { nullable: true })
  @Expose({ name: 'created_by' })
  createdBy: number;

  @Field(() => Boolean, { nullable: true })
  status: boolean;

  @Field({ nullable: true })
  @Expose({ name: 'created_at' })
  @Type(() => Date)
  createdAt: Date;

  @Field({ nullable: true })
  @Expose({ name: 'updated_at' })
  @Type(() => Date)
  updatedAt: Date;
}
