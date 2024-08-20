import { registerEnumType } from 'type-graphql';

export enum RoleResourceStatus {
  ACTIVE = 1,
  DEACTIVE = 2,
}

registerEnumType(RoleResourceStatus, {
  name: 'RoleResourceStatus',
});
