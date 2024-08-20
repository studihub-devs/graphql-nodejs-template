import { createUnionType } from 'type-graphql';

import { CommonError } from '../../core/types/common-error';
import { EmailError } from './email-error';
import { EmailPayload } from './email-payload';

export const EmailOrError = createUnionType({
  name: 'EmailOrError',
  types: () => [EmailPayload, EmailError, CommonError],
});
