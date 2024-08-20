import { createUnionType } from 'type-graphql';
import { APIResource } from '../entities/api-resource.entity';
import { CommonError } from '../../../core/types/common-error';
export const APIResourceOrError = createUnionType({
  name: 'APIResourceOrError',
  types: () => [APIResource, CommonError],
});
