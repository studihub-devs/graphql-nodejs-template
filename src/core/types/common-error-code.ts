import { registerEnumType } from 'type-graphql';
export enum CommonErrorCode {
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',

  USER_INPUT_ERROR = 'BAD_REQUEST (INVALID INPUT)!',
}

registerEnumType(CommonErrorCode, {
  name: 'CommonErrorCode',
  description: 'Common error codes',
});
