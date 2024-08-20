import { IsEmail } from 'class-validator';
import { Int, Field, ObjectType } from 'type-graphql';
import { Expose, Type } from 'class-transformer';
import { Gender } from '../types/gender';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  name: string;

  @Field(() => Gender, { nullable: true })
  gender: Gender;

  @Field({ nullable: true })
  avatar: string;

  @Field({ nullable: true })
  country: string;

  @Field(() => Int, { nullable: true })
  @Expose({ name: 'role_id' })
  roleId?: number;

  @Field(() => Int, { nullable: true })
  @Expose({ name: 'wallet_id' })
  walletId?: number;

  @Field(() => Boolean, { nullable: true })
  @Expose({ name: 'is_active' })
  isActive: boolean;

  @Field({ nullable: true })
  @Expose({ name: 'created_at' })
  @Type(() => Date)
  createdAt: Date;

  @Field({ nullable: true })
  @Expose({
    name: 'update_at',
  })
  @Type(() => Date)
  updatedAt: Date;
}
