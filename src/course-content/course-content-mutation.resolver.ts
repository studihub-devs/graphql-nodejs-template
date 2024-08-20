import { Resolver, Mutation, Arg, Ctx, Authorized, Info } from 'type-graphql';
import { injectable } from 'inversify';

import { Context } from '../core/types/context';
import { GraphQLResolveInfo } from 'graphql';
import { CourseContent } from './entities/course-content.entity';
import { CourseContentService } from './services/course-content.service';
import { CourseContentOrError } from './types/course-content-or-error';
import { InsertCourseContentInput } from './types/insert-course-content.input';
import { CourseContentWhereInput } from './types/course-content-where.input';
import { UpdateCourseContentInput } from './types/update-course-content.input';
import { UpdateCourseContentSeqInput } from './types/update-course-content-seq.input';
import { CanMutateCourseContent } from './shared/can-mutate-course-content.guard';

@injectable()
@Resolver(() => CourseContent)
export class CourseContentMutationResolver {
  constructor(private courseContentService: CourseContentService) {}

  @Authorized()
  @CanMutateCourseContent()
  @Mutation(() => CourseContentOrError)
  async createCourseContent(
    @Arg('data') data: InsertCourseContentInput,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<typeof CourseContentOrError> {
    return this.courseContentService.create(data, info, ctx);
  }

  @Authorized()
  @CanMutateCourseContent()
  @Mutation(() => CourseContentOrError)
  async updateCourseContent(
    @Arg('data') data: UpdateCourseContentInput,
    @Arg('where') where: CourseContentWhereInput,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<typeof CourseContentOrError> {
    return this.courseContentService.update(data, where, info, ctx);
  }

  @Authorized()
  @CanMutateCourseContent()
  @Mutation(() => CourseContentOrError)
  async deleteCourseContent(
    @Arg('where') where: CourseContentWhereInput,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<typeof CourseContentOrError> {
    return this.courseContentService.delete(where, info, ctx);
  }

  @Authorized()
  @Mutation(() => CourseContentOrError)
  async mutateStatusCourseContent(
    @Arg('data') data: UpdateCourseContentInput,
    @Arg('where') where: CourseContentWhereInput,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<typeof CourseContentOrError> {
    return this.courseContentService.mutateStatus(data, where, info, ctx);
  }

  @Authorized()
  @CanMutateCourseContent()
  @Mutation(() => CourseContentOrError)
  async mutateSeqCourseContent(
    @Arg('data', () => [UpdateCourseContentSeqInput]) 
      data: UpdateCourseContentSeqInput[],    
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<typeof CourseContentOrError> {
    return this.courseContentService.mutateSeq(data, info, ctx);
  }
}
