import { createUnionType } from 'type-graphql';
import { Resource } from '../entities/resource.entity';
import { CommonError } from '../../../core/types/common-error';

export const ResourceOrError = createUnionType({
  name: 'ResourceOrError',
  types: () => [Resource, CommonError],
});
