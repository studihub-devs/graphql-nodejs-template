import { injectable } from 'inversify';
import { Args, Ctx, Info, Query, Resolver } from 'type-graphql';
import { GraphQLResolveInfo } from 'graphql';
import _ from 'lodash';
import { Context } from '../core/types/context';
import { CourseAttachFile } from './entities/course-attach-file.entity';
import { CourseAttachFileService } from './services/course-attach-file.service';
import { CourseAttachFileArgs } from './types/course-attach-file.args';
import { CourseAttachFileConnection } from './types/course-attach-file.connection';

@injectable()
@Resolver(() => CourseAttachFile)
export class CourseAttachFileResolver {
  constructor(private courseAttachFileService: CourseAttachFileService) {}

  @Query(() => CourseAttachFileConnection)
  courseAttachFileConnection(
    @Args() args: CourseAttachFileArgs,
  ): CourseAttachFileConnection {
    return new CourseAttachFileConnection(args);
  }

  @Query(() => [CourseAttachFile])
  async courseAttachFiles(
    @Args() args: CourseAttachFileArgs,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<CourseAttachFile[]> {
    return this.courseAttachFileService.getMany(args, info, ctx);
  }
}
