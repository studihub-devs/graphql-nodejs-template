import { Field, Int, ObjectType } from 'type-graphql';
import { Expose, Type } from 'class-transformer';

@ObjectType()
export class Role {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => Int, { nullable: true })
  @Expose({ name: 'created_by' })
  createdBy: number;

  @Field()
  @Expose({ name: 'created_at' })
  @Type(() => Date)
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  @Expose({ name: 'updated_at' })
  @Type(() => Date)
  updatedAt?: Date;
}
