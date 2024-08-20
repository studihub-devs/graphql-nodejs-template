import { Field, ObjectType } from 'type-graphql';

import { CommonSuccessCode } from './common-success-code';
import { SuccessStatus } from './success-status';

@ObjectType()
export class CommonSuccess {
  message: string;

  status: SuccessStatus;

  @Field(() => CommonSuccessCode)
  code: CommonSuccessCode;
}
