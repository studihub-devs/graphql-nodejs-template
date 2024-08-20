import { injectable } from 'inversify';
import { FieldResolver, Resolver, Int, Root } from 'type-graphql';
import { CourseContentService } from './services/course-content.service';
import { CourseContentConnectionAggregate } from './types/course-content.aggregate-connection';

@injectable()
@Resolver(() => CourseContentConnectionAggregate)
export class CourseContentAggreateResolver {
  constructor(private courseContentService: CourseContentService) {}

  @FieldResolver(() => Int)
  async count(
    @Root() aggregate: CourseContentConnectionAggregate,
  ): Promise<number> {
    return this.courseContentService.getCount(aggregate.args);
  }
}
