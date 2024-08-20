import { ObjectType } from 'type-graphql';
import { RolesArgs } from './role.args';

@ObjectType()
export class RolesConnectionAggregate {
  constructor(public readonly args: RolesArgs) {}
}
