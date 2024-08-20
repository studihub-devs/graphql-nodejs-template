import { registerEnumType } from 'type-graphql';
export enum ErrorStatus {
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,

  UNPROCESSABLE = 422,

  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  BAD_REQUEST = 400,
}

registerEnumType(ErrorStatus, {
  name: 'ErrorStatus',
  description: 'Common error status',
});
