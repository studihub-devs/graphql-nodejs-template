import { ContainerModule, interfaces } from 'inversify';
import { LOADER_TYPES } from '../core/dataloader/loader-types';
import { CourseContentAggreateResolver } from './course-content-aggregate.resolve';
import { CourseContentMutationResolver } from './course-content-mutation.resolver';
import { CourseContentEdgeResolver } from './course-content-relay-edge.resolver';
import { CourseContentResolver } from './course-content.resolve';
import { createChildContentByCourseContentIdLoader } from './services/child-course-content-by-course-id.loader';
import { createCourseAttachFileByCourseContentIdLoader } from './services/course-attach-file-by-course-content-id.loader';
import { createCourseContentLoader } from './services/course-content-by-id.loader';
import { CourseContentService } from './services/course-content.service';
import { createQuizByCourseContentIdLoader } from './services/quiz-by-course-content-id.loader';

export const CourseContentModule = new ContainerModule(
  (bind: interfaces.Bind) => {
    bind(CourseContentService)
      .toSelf()
      .inSingletonScope();
    bind(CourseContentResolver)
      .toSelf()
      .inSingletonScope();
    bind(CourseContentEdgeResolver)
      .toSelf()
      .inSingletonScope();
    bind(CourseContentMutationResolver)
      .toSelf()
      .inSingletonScope();
    bind(CourseContentAggreateResolver)
      .toSelf()
      .inSingletonScope();
    bind(LOADER_TYPES.CourseAttachFileByCourseContentIdLoader)
      .toDynamicValue(() => createCourseAttachFileByCourseContentIdLoader());
    bind(LOADER_TYPES.QuizByCourseContentIdLoader)
      .toDynamicValue(() => createQuizByCourseContentIdLoader());
    bind(LOADER_TYPES.CourseContentLoader).toDynamicValue(() => createCourseContentLoader());
    bind(LOADER_TYPES.ChildContentByCourseContentIdLoader).toDynamicValue(() => createChildContentByCourseContentIdLoader());
  },
);