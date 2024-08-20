import { ContainerModule, interfaces } from 'inversify';
import { APIResouceService } from './services/api-resource.service';
import { APIResourceResolver } from './api-resource.resolver';
import { APIResouceAggregateResolver } from './api-resource-aggregate.resolver';

export const APIResourceModule = new ContainerModule(
  (bind: interfaces.Bind) => {
    bind(APIResouceService)
      .toSelf()
      .inSingletonScope();
    bind(APIResourceResolver)
      .toSelf()
      .inSingletonScope();
    bind(APIResouceAggregateResolver)
      .toSelf()
      .inSingletonScope();
  },
);
