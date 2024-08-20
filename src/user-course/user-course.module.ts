import { ContainerModule, interfaces } from 'inversify';

import { UserCourseService } from './services/user-course.service';
import { UserCourseResolver } from './user-course.resolver';

export const UserCourseModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(UserCourseService)
    .toSelf()
    .inSingletonScope();
  bind(UserCourseResolver)
    .toSelf()
    .inSingletonScope();
});
