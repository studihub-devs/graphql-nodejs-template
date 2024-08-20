import { ContainerModule, interfaces } from 'inversify';
import { CourseCategoryService } from './services/course-category.service';
import { CourseCategoryResolver } from './course-category.resolver';
import { CourseCategoryAggreateResolver } from './course-category-aggregate.resolve';

export const CourseCategoryModule = new ContainerModule(
  (bind: interfaces.Bind) => {
    bind(CourseCategoryService)
      .toSelf()
      .inSingletonScope();
    bind(CourseCategoryResolver)
      .toSelf()
      .inSingletonScope();
    bind(CourseCategoryAggreateResolver)
      .toSelf()
      .inSingletonScope();
  },
);
