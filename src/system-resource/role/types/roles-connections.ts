import { ObjectType } from 'type-graphql';
import { RolesArgs } from './role.args';
import { RolesConnectionAggregate } from './roles.aggregate-connection';
import Connection from '../../../shared/types/connection';

@ObjectType()
export class RolesConnection extends Connection(RolesConnectionAggregate) {
  constructor(args: RolesArgs) {
    super();
    this.aggregate = new RolesConnectionAggregate(args);
  }
}
