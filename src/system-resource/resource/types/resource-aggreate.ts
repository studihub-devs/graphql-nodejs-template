import { ObjectType } from 'type-graphql';
import { ResourcesArgs } from './resources.args';

@ObjectType()
export class ResourceConnectionAggregate {
  constructor(public readonly args: ResourcesArgs) {}
}
