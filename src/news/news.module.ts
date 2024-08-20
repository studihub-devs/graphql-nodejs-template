import { ContainerModule, interfaces } from 'inversify';
import { LOADER_TYPES } from '../core/dataloader/loader-types';
import { NewsResolver } from './news.resolve';
import { NewsService } from './services/news.service';
import { NewsAggreateResolver } from './news-aggregate.resolve';
import { NewsEdgeResolver } from './news-relay-edge.resolver';
import { createNewsLoader } from './services/news-by-id.loader';

export const NewsModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(NewsService)
    .toSelf()
    .inSingletonScope();
  bind(NewsResolver)
    .toSelf()
    .inSingletonScope();
  bind(NewsAggreateResolver)
    .toSelf()
    .inSingletonScope();
  bind(NewsEdgeResolver)
    .toSelf()
    .inSingletonScope();
  bind(LOADER_TYPES.NewsLoader).toDynamicValue(() => createNewsLoader());
});
