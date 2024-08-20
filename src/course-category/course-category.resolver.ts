import { injectable } from 'inversify';
import { Args, Ctx, Info, Query, Resolver } from 'type-graphql';
import { GraphQLResolveInfo } from 'graphql';
import _ from 'lodash';
import { Context } from '../core/types/context';
import { CourseCategory } from './entities/course-category.entity';
import { CourseCategoryService } from './services/course-category.service';
import { CourseCategoryArgs } from './types/course-category.args';
import { CourseCategoryConnection } from './types/course-category.connection';

@injectable()
@Resolver(() => CourseCategory)
export class CourseCategoryResolver {
  constructor(private courseCategoryService: CourseCategoryService) {}

  @Query(() => CourseCategoryConnection)
  courseCategoryConnection(
    @Args() args: CourseCategoryArgs,
  ): CourseCategoryConnection {
    return new CourseCategoryConnection(args);
  }

  @Query(() => [CourseCategory])
  async courseCategories(
    @Args() args: CourseCategoryArgs,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<CourseCategory[]> {
    return this.courseCategoryService.getMany(args, info, ctx);
  }
}
