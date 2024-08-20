import { Field, ObjectType } from 'type-graphql';
import _ from 'lodash';

import { Error } from '../../core/types/error';
import { ErrorStatus } from '../../core/types/error-status';
import { EmailErrorCode } from './email-error-code';

@ObjectType({ implements: Error })
export class EmailError implements Error {
  constructor(options: Partial<EmailError>) {
    _.forIn(options, (value, key) => {
      this[`${key}`] = value;
    });
  }

  message: string;

  status: ErrorStatus;

  @Field(() => EmailErrorCode)
  code: EmailErrorCode;
}
