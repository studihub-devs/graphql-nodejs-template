import { injectable } from 'inversify';
import { FieldResolver, Int, Resolver, Root } from 'type-graphql';
import { ResourceService } from './services/resource.service';
import { ResourceConnectionAggregate } from './types/resource-aggreate';

@injectable()
@Resolver(() => ResourceConnectionAggregate)
export class ResourceAggregateResolver {
  constructor(private resourceService: ResourceService) {}

  @FieldResolver(() => Int)
  async count(@Root() aggregate: ResourceConnectionAggregate): Promise<number> {
    return this.resourceService.getCount(aggregate.args);
  }
}
