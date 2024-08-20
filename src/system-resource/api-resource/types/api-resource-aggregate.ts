import { ObjectType } from 'type-graphql';
import { APIResourceArgs } from './api-resource.args';

@ObjectType()
export class APIResourceConnectionAggregate {
  constructor(public readonly args: APIResourceArgs) {}
}
