import { ContainerModule, interfaces } from 'inversify';
import { CourseViewershipAggreateResolver } from './course-viewership-aggregate.resolve';
import { CourseViewershipResolver } from './course-viewership.resolver';
import { CourseViewershipService } from './services/course-viewership.service';

export const CourseViewershipModule = new ContainerModule(
  (bind: interfaces.Bind) => {
    bind(CourseViewershipService)
      .toSelf()
      .inSingletonScope();
    bind(CourseViewershipResolver)
      .toSelf()
      .inSingletonScope();
    bind(CourseViewershipAggreateResolver)
      .toSelf()
      .inSingletonScope();
  },
);
