import { injectable } from 'inversify';
import { FieldResolver, Resolver, Int, Root } from 'type-graphql';
import { CourseService } from './services/course.service';
import { CourseConnectionAggregate } from './types/course.aggregate-connection';

@injectable()
@Resolver(() => CourseConnectionAggregate)
export class CourseAggreateResolver {
  constructor(private courseService: CourseService) {}

  @FieldResolver(() => Int)
  async count(@Root() aggregate: CourseConnectionAggregate): Promise<number> {
    return this.courseService.getCount(aggregate.args);
  }
}
