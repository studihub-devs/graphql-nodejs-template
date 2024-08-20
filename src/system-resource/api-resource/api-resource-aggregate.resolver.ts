import { injectable } from 'inversify';
import { FieldResolver, Int, Resolver, Root } from 'type-graphql';
import { APIResouceService } from './services/api-resource.service';
import { APIResourceConnectionAggregate } from './types/api-resource-aggregate';

@injectable()
@Resolver(() => APIResourceConnectionAggregate)
export class APIResouceAggregateResolver {
  constructor(private apiService: APIResouceService) {}

  @FieldResolver(() => Int)
  async count(
    @Root() aggregate: APIResourceConnectionAggregate,
  ): Promise<number> {
    return this.apiService.getCount(aggregate.args);
  }
}
