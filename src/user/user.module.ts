import { ContainerModule, interfaces } from 'inversify';
import { UserService } from './services/user.service';
import { UserResolver } from './user.resolver';
import { LOADER_TYPES } from '../core/dataloader/loader-types';
import { createUserLoader } from './services/user-by-id.loader';

export const UserModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(UserService)
    .toSelf()
    .inSingletonScope();
  bind(UserResolver)
    .toSelf()
    .inSingletonScope();
  bind(LOADER_TYPES.UserLoader).toDynamicValue(() => createUserLoader());
});
