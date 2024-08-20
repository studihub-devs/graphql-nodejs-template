import { ContainerModule, interfaces } from 'inversify';
import { LOADER_TYPES } from '../core/dataloader/loader-types';
import { CourseAggreateResolver } from './course-aggregate.resolver';
import { CourseMutationResolver } from './course-mutation.resolver';
import { CourseEdgeResolver } from './course-relay-edge.resolver';
import { CourseResolver } from './course.resolver';
import { createCourseLoader } from './services/course-by-id.loader';
import { createCourseContentByCourseIdLoader } from './services/course-content-by-course-id.loader';
import { createCourseReactByCourseIdLoader } from './services/course-react-by-course-id.loader';
import { createCourseReactCountLoader } from './services/course-react-count.loader';
import { createAverageRatingByCourseIdLoader } from './services/course-review-average-rate.loader';
import { createCourseReviewByCourseIdLoader } from './services/course-review-by-course-id.loader';
import { createCourseReviewCountLoader } from './services/course-review-count.loader';
import { CourseService } from './services/course.service';
import { createCourseViewershipByCourseIdLoader } from './services/course-viewership-by-course-id.loader';
import { createCourseViewershipCountLoader } from './services/course-viewership-count.loader';

export const CourseModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(CourseService)
    .toSelf()
    .inSingletonScope();
  bind(CourseResolver)
    .toSelf()
    .inSingletonScope(); 
  bind(CourseMutationResolver)
    .toSelf()
    .inSingletonScope(); 
  bind(CourseAggreateResolver)
    .toSelf()
    .inSingletonScope();
  bind(CourseEdgeResolver)
    .toSelf()
    .inSingletonScope();
  bind(LOADER_TYPES.CourseLoader).toDynamicValue(() => createCourseLoader());
  bind(LOADER_TYPES.CourseContentByCourseIdLoader).toDynamicValue(() =>
    createCourseContentByCourseIdLoader(),
  );
  bind(LOADER_TYPES.CourseReviewCountLoader).toDynamicValue(() =>
    createCourseReviewCountLoader(),
  );
  bind(LOADER_TYPES.CourseReactCountLoader).toDynamicValue(() =>
    createCourseReactCountLoader(),
  );
  bind(LOADER_TYPES.CourseViewershipCountLoader).toDynamicValue(() =>
    createCourseViewershipCountLoader(),
  );
  bind(LOADER_TYPES.AverageRatingByCourseIdLoader).toDynamicValue(() =>
    createAverageRatingByCourseIdLoader(),
  );
  bind(LOADER_TYPES.CourseReviewByCourseIdLoader).toDynamicValue(() =>
    createCourseReviewByCourseIdLoader(),
  );
  bind(LOADER_TYPES.CourseReactByCourseIdLoader).toDynamicValue(() =>
    createCourseReactByCourseIdLoader(),
  );
  bind(LOADER_TYPES.CourseViewershipByCourseIdLoader).toDynamicValue(() =>
    createCourseViewershipByCourseIdLoader(),
  );
});
