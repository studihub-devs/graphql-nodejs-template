import { GraphQLResolveInfo } from 'graphql';
import { injectable } from 'inversify';
import _ from 'lodash';
import { LOADER_TYPES } from '../core/dataloader/loader-types';
import { Loader } from '../core/decorators/loader.decorator';
import { FieldResolver, Info, Resolver, Root } from 'type-graphql';
import { News } from './entities/news.entity';
import { NewsLoader } from './services/news-by-id.loader';
import { NewsService } from './services/news.service';
import { NewsEdge } from './types/news-edge';
import { decodeCursor } from '../utils/cursor-buffer';

@injectable()
@Resolver(() => NewsEdge)
export class NewsEdgeResolver {
  constructor(private newsService: NewsService) {}

  @FieldResolver(() => News)
  async node(
    @Root() edge: NewsEdge,
    @Info() info: GraphQLResolveInfo,
    @Loader(LOADER_TYPES.NewsLoader) loader: NewsLoader,
  ): Promise<News> {
    const currObject = JSON.parse(decodeCursor(edge.cursor));
    return loader.load({
      id: parseInt(currObject['id']),
      fields: this.newsService.getFieldList(info),
    });
  }
}
