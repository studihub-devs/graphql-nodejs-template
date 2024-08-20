import { injectable } from 'inversify';
import { FieldResolver, Int, Resolver, Root } from 'type-graphql';
import { CourseViewershipService } from './services/course-viewership.service';
import { CourseViewershipConnectionAggregate } from './types/course-viewership.aggregate-connection';

@injectable()
@Resolver(() => CourseViewershipConnectionAggregate)
export class CourseViewershipAggreateResolver {
  constructor(private courseViewershipService: CourseViewershipService) {}

  @FieldResolver(() => Int)
  async count(
    @Root() aggregate: CourseViewershipConnectionAggregate,
  ): Promise<number> {
    return this.courseViewershipService.getCount(aggregate.args);
  }
}
