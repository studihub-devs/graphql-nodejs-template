import { ObjectType } from 'type-graphql';
import Connection from '../../../shared/types/connection';
import { ResourceConnectionAggregate } from './resource-aggreate';
import { ResourcesArgs } from './resources.args';

@ObjectType()
export class ResourceConnection extends Connection(
  ResourceConnectionAggregate,
) {
  constructor(args: ResourcesArgs) {
    super();
    this.aggregate = new ResourceConnectionAggregate(args);
  }
}
