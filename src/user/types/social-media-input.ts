import { InputType, Field } from 'type-graphql';
import { SocialType } from './social-type';

@InputType()
export class SocialMediaInput {
  @Field(() => SocialType, { nullable: true })
  type: SocialType;

  @Field(() => String, { nullable: true })
  link: string;
}
