import { Type } from 'class-transformer';
import { ObjectType, Field } from 'type-graphql';

import { User } from '../../user/entities/user.entity';

@ObjectType('UserCreateUserAuthPayload')
export class UserCreateUserAuthPayload {
  @Field()
  token: string;

  @Field(() => User)
  @Type(() => User)
  user: User;
}
