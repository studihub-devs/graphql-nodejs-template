import { injectable } from 'inversify';
import {
  Arg,
  Args,
  Authorized,
  Ctx,
  FieldResolver,
  Info,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';

import { GraphQLResolveInfo } from 'graphql';
import { LOADER_TYPES } from '../core/dataloader/loader-types';
import { Loader } from '../core/decorators/loader.decorator';
import { Context } from '../core/types/context';
import { Course } from '../course/entities/course.entity';
import { CourseLoader } from '../course/services/course-by-id.loader';
import { CourseService } from '../course/services/course.service';
import { User } from '../user/entities/user.entity';
import { UserLoader } from '../user/services/user-by-id.loader';
import { UserService } from '../user/services/user.service';
import { CourseViewership } from './entities/course-viewership.entity';
import { CourseViewershipService } from './services/course-viewership.service';
import { CourseNotPublic } from './shared/course-not-public.guard';
import { CreateCourseViewershipInput } from './types/course-viewership-create.input';
import { CourseViewershipOrError } from './types/course-viewership-or-error';
import { CourseViewershipArgs } from './types/course-viewership.args';
import { CourseViewershipConnection } from './types/course-viewership.connection';

@injectable()
@Resolver(() => CourseViewership)
export class CourseViewershipResolver {
  constructor(
    private courseViewershipService: CourseViewershipService,
    private courseService: CourseService,
    private userService: UserService,
  ) {}

  @FieldResolver(() => Course, { nullable: true })
  async course(
    @Root() courseViewership: CourseViewership,
    @Info() info: GraphQLResolveInfo,
    @Loader(LOADER_TYPES.CourseLoader)
    loader: CourseLoader,
  ): Promise<Course> {
    return loader.load({
      id: courseViewership.courseId,
      fields: this.courseService.getFieldList(info),
    });
  }

  @FieldResolver(() => User, { nullable: true })
  async user(
    @Root() courseViewership: CourseViewership,
    @Info() info: GraphQLResolveInfo,
    @Loader(LOADER_TYPES.UserLoader) userLoader: UserLoader,
  ): Promise<User> {
    if (!courseViewership?.userId) {
      return null;
    }
    return userLoader.load({
      id: courseViewership.userId,
      fields: this.userService.getFieldList(info),
    });
  }

  @Authorized()
  @CourseNotPublic()
  @Mutation(() => CourseViewershipOrError)
  async viewershipCourse(
    @Arg('data') data: CreateCourseViewershipInput,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<typeof CourseViewershipOrError> {
    return this.courseViewershipService.create(data, info, ctx);
  }

  @Query(() => CourseViewershipConnection)
  CourseViewershipConnection(
    @Args() args: CourseViewershipArgs,
  ): CourseViewershipConnection {
    return new CourseViewershipConnection(args);
  }

  @Query(() => [CourseViewership])
  async courseViewerships(
    @Args() args: CourseViewershipArgs,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<CourseViewership[]> {
    return this.courseViewershipService.getMany(args, info, ctx);
  }
}
