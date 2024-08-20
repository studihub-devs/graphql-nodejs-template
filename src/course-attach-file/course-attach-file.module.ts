import { ContainerModule, interfaces } from 'inversify';
import { CourseAttachFileAggreateResolver } from './course-aggregate.resolve';
import { CourseAttachFileResolver } from './course-attach-file.resolve';
import { CourseAttachFileService } from './services/course-attach-file.service';

export const CourseAttachFileModule = new ContainerModule(
  (bind: interfaces.Bind) => {
    bind(CourseAttachFileService)
      .toSelf()
      .inSingletonScope();
    bind(CourseAttachFileResolver)
      .toSelf()
      .inSingletonScope();
    bind(CourseAttachFileAggreateResolver)
      .toSelf()
      .inSingletonScope();
  },
);
