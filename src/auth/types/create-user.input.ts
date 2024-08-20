import { InputType, Field, Int } from 'type-graphql';
import { IsEmail } from 'class-validator';
import { Gender } from '../../user/types/gender';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => Gender, { nullable: true })
  gender?: Gender;

  @Field(() => Int, { nullable: true })
  roleId?: number;

  @Field(() => Int, { nullable: true })
  walletId?: number;
}
