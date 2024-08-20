import { ObjectType, Field } from 'type-graphql';
import { SocialType } from './social-type';

@ObjectType()
export class SocialMedia {
  @Field(() => SocialType, { nullable: true })
  type?: SocialType;

  @Field(() => String, { nullable: true })
  link?: string;
}
