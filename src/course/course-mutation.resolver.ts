import { Resolver, Mutation, Arg, Ctx, Authorized, Info } from 'type-graphql';
import { injectable } from 'inversify';

import { Context } from '../core/types/context';
import { GraphQLResolveInfo } from 'graphql';
import { Course } from '../course/entities/course.entity';
import { CourseService } from '../course/services/course.service';
import { CourseOrError } from './types/course-or-error';
import { CanMutateCourse } from './shared/can-mutate-course.guard';
import { CourseWhereInput } from './types/course-where.input';
import { UpdateCourseInput } from './types/update-course.input';
import { InsertCourseInput } from './types/insert-course.input';

@injectable()
@Resolver(() => Course)
export class CourseMutationResolver {
  constructor(private courseService: CourseService) {}

  @Authorized()
  @CanMutateCourse()
  @Mutation(() => CourseOrError)
  async createCourse(
    @Arg('data') data: InsertCourseInput,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<typeof CourseOrError> {
    return this.courseService.create(data, info, ctx);
  }

  @Authorized()
  @CanMutateCourse()
  @Mutation(() => CourseOrError)
  async updateCourse(
    @Arg('data') data: UpdateCourseInput,
    @Arg('where') where: CourseWhereInput,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<typeof CourseOrError> {
    return this.courseService.update(data, where, info, ctx);
  }

  @Authorized()
  @CanMutateCourse()
  @Mutation(() => CourseOrError)
  async deleteCourse(
    @Arg('where') where: CourseWhereInput,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<typeof CourseOrError> {
    return this.courseService.delete(where, info, ctx);
  }

  @Authorized()
  @Mutation(() => CourseOrError)
  async mutateStatusCourse(
    @Arg('data') data: UpdateCourseInput,
    @Arg('where') where: CourseWhereInput,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<typeof CourseOrError> {
    return this.courseService.mutateStatus(data, where, info, ctx);
  }
}
