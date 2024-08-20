import { injectable } from 'inversify';
import { FieldResolver, Int, Resolver, Root } from 'type-graphql';
import { CourseReactService } from './services/course-react.service';
import { CourseReactConnectionAggregate } from './types/course-react.aggregate-connection';

@injectable()
@Resolver(() => CourseReactConnectionAggregate)
export class CourseReactAggreateResolver {
  constructor(private courseReactService: CourseReactService) {}

  @FieldResolver(() => Int)
  async count(
    @Root() aggregate: CourseReactConnectionAggregate,
  ): Promise<number> {
    return this.courseReactService.getCount(aggregate.args);
  }
}
