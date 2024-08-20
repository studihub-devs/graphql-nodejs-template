import { ObjectType } from 'type-graphql';
import Connection from '../../../shared/types/connection';
import { APIResourceArgs } from './api-resource.args';
import { APIResourceConnectionAggregate } from './api-resource-aggregate';

@ObjectType()
export class APIResourceConnection extends Connection(
  APIResourceConnectionAggregate,
) {
  constructor(args: APIResourceArgs) {
    super();
    this.aggregate = new APIResourceConnectionAggregate(args);
  }
}
