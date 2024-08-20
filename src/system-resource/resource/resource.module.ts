import { ContainerModule, interfaces } from 'inversify';
import { ResourceAggregateResolver } from './resource-aggregate.resolver';

import { ResourceResolver } from './resource.resolver';

import { ResourceService } from './services/resource.service';
import { LOADER_TYPES } from '../../core/dataloader/loader-types';
import { createResourceLoader } from './services/resource-by-id.loader';

export const ResourceModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(ResourceService)
    .toSelf()
    .inSingletonScope();
  bind(ResourceResolver)
    .toSelf()
    .inSingletonScope();
  bind(ResourceAggregateResolver)
    .toSelf()
    .inSingletonScope();
  bind(LOADER_TYPES.ResourceLoader).toDynamicValue(() => createResourceLoader);
});
