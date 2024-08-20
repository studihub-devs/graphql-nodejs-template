import { ContainerModule, interfaces } from 'inversify';
import { RoleResourceResolver } from './role-resource.resolver';
import { RoleResourceService } from './services/role-resource.service';

export const RoleResourceModule = new ContainerModule(
  (bind: interfaces.Bind) => {
    bind(RoleResourceService)
      .toSelf()
      .inSingletonScope();
    bind(RoleResourceResolver)
      .toSelf()
      .inSingletonScope();
  },
);
