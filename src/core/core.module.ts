import { ContainerModule, interfaces } from 'inversify';

import { HashIdsService } from './services/hash-ids.service';

export const CoreModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(HashIdsService)
    .toSelf()
    .inSingletonScope();
});
