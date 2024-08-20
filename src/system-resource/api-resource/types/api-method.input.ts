import { registerEnumType } from 'type-graphql';

export enum APIMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

registerEnumType(APIMethod, {
  name: 'APIMethod',
});
