import { injectable } from 'inversify';
import { FieldResolver, Resolver, Int, Root } from 'type-graphql';
import { CourseCategoryService } from './services/course-category.service';
import { CourseCategoryConnectionAggregate } from './types/course-category.aggregate-connection';

@injectable()
@Resolver(() => CourseCategoryConnectionAggregate)
export class CourseCategoryAggreateResolver {
  constructor(private courseCategoryService: CourseCategoryService) {}

  @FieldResolver(() => Int)
  async count(
    @Root() aggregate: CourseCategoryConnectionAggregate,
  ): Promise<number> {
    return this.courseCategoryService.getCount(aggregate.args);
  }
}
