import { createUnionType } from 'type-graphql';
import { Role } from '../entities/role.entity';
import { CommonError } from '../../../core/types/common-error';

export const RoleOrError = createUnionType({
  name: 'RoleOrError',
  types: () => [Role, CommonError],
});
