import { ContainerModule, interfaces } from 'inversify';

import { UserAuthResolver } from './user-auth.resolver';
import { UserAuthService } from './services/user-auth.service';
import { JwtService } from './services/jwt.service';
import { OtpService } from './services/otp.service';

export const AuthModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(UserAuthService)
    .toSelf()
    .inSingletonScope();
  bind(UserAuthResolver)
    .toSelf()
    .inSingletonScope();
  bind(JwtService)
    .toSelf()
    .inSingletonScope();
  bind(OtpService)
    .toSelf()
    .inSingletonScope();
});
