import { ContainerModule, interfaces } from 'inversify';
import { CourseReviewAggreateResolver } from './course-review-aggregate.resolve';
import { CourseReviewResolver } from './course-review.resolver';
import { CourseReviewService } from './services/course-review.service';

export const CourseReviewModule = new ContainerModule(
  (bind: interfaces.Bind) => {
    bind(CourseReviewService)
      .toSelf()
      .inSingletonScope();
    bind(CourseReviewResolver)
      .toSelf()
      .inSingletonScope();
    bind(CourseReviewAggreateResolver)
      .toSelf()
      .inSingletonScope();
  },
);
