import { ContainerModule, interfaces } from 'inversify';
import { CourseReactAggreateResolver } from './course-react-aggregate.resolve';
import { CourseReactResolver } from './course-react.resolver';
import { CourseReactService } from './services/course-react.service';

export const CourseReactModule = new ContainerModule(
  (bind: interfaces.Bind) => {
    bind(CourseReactService)
      .toSelf()
      .inSingletonScope();
    bind(CourseReactResolver)
      .toSelf()
      .inSingletonScope();
    bind(CourseReactAggreateResolver)
      .toSelf()
      .inSingletonScope();
  },
);
