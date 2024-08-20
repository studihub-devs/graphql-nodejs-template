import { injectable } from 'inversify';
import { FieldResolver, Resolver, Int, Root } from 'type-graphql';
import { NewsService } from './services/news.service';
import { NewsConnectionAggregate } from './types/news.aggregate-connection';

@injectable()
@Resolver(() => NewsConnectionAggregate)
export class NewsAggreateResolver {
  constructor(private newsService: NewsService) {}

  @FieldResolver(() => Int)
  async count(@Root() aggregate: NewsConnectionAggregate): Promise<number> {
    return this.newsService.getCount(aggregate.args);
  }
}
