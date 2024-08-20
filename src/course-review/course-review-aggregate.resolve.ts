import { injectable } from 'inversify';
import { FieldResolver, Int, Resolver, Root } from 'type-graphql';
import { CourseReviewService } from './services/course-review.service';
import { CourseReviewConnectionAggregate } from './types/course-review.aggregate-connection';

@injectable()
@Resolver(() => CourseReviewConnectionAggregate)
export class CourseReviewAggreateResolver {
  constructor(private courseReviewService: CourseReviewService) {}

  @FieldResolver(() => Int)
  async count(
    @Root() aggregate: CourseReviewConnectionAggregate,
  ): Promise<number> {
    return this.courseReviewService.getCount(aggregate.args);
  }
}
