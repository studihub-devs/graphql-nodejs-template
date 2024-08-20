import { injectable } from 'inversify';
import { FieldResolver, Resolver, Int, Root } from 'type-graphql';
import { CourseAttachFileService } from './services/course-attach-file.service';
import { CourseAttachFileConnectionAggregate } from './types/course-attach-file.aggregate-connection';

@injectable()
@Resolver(() => CourseAttachFileConnectionAggregate)
export class CourseAttachFileAggreateResolver {
  constructor(private courseAttachFileService: CourseAttachFileService) {}

  @FieldResolver(() => Int)
  async count(
    @Root() aggregate: CourseAttachFileConnectionAggregate,
  ): Promise<number> {
    return this.courseAttachFileService.getCount(aggregate.args);
  }
}
