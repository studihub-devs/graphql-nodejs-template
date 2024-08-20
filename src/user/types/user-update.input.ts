import { InputType, Field, Int } from 'type-graphql';
import { Gender } from './gender';
import { Type } from 'class-transformer';
import { SocialMediaInput } from './social-media-input';

@InputType()
export class UserUpdateInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  name: string;

  @Field(() => Gender)
  gender: Gender;

  @Type(() => Date)
  birthDay: Date;

  @Field()
  phoneNumber: string;

  @Field({ nullable: true })
  avatarUrl?: string;

  @Field(() => Int, { nullable: true })
  roleId?: number;

  @Field(() => [SocialMediaInput], { nullable: true })
  socialMedia?: SocialMediaInput;
}
