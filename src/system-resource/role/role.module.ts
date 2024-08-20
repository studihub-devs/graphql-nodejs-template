import { ContainerModule, interfaces } from 'inversify';
import { RoleAggreateResolver } from './roles-aggregate.resolver';
import { RoleService } from './services/role.service';
import { RoleResolver } from './role.resolver';

export const RoleModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(RoleService)
    .toSelf()
    .inSingletonScope();
  bind(RoleResolver)
    .toSelf()
    .inSingletonScope();
  bind(RoleAggreateResolver)
    .toSelf()
    .inSingletonScope();
});
