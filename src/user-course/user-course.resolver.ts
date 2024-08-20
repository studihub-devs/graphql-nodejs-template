import {
  Resolver,
  Mutation,
  Arg,
  Ctx,
  Authorized,
  Info,
  FieldResolver,
  Root,
} from 'type-graphql';
import { injectable } from 'inversify';

import { Context } from '../core/types/context';
import { UserCourseService } from './services/user-course.service';
import { UserCourseOrError } from './types/user-course-or-error';
import { CreateUserCourseInput } from './types/user-course-create.input';
import { CourseNotPublic } from './shared/course-not-public.guard';
import { GraphQLResolveInfo } from 'graphql';
import { Course } from '../course/entities/course.entity';
import { UserCourse } from './entities/user-course.entity';
import { Loader } from '../core/decorators/loader.decorator';
import { LOADER_TYPES } from '../core/dataloader/loader-types';
import { CourseLoader } from '../course/services/course-by-id.loader';
import { CourseService } from '../course/services/course.service';
import { UserAlreadyRegisteredCourse } from './shared/user-already-registered-course.guard';

@injectable()
@Resolver(() => UserCourse)
export class UserCourseResolver {
  constructor(
    private userCourseService: UserCourseService,
    private courseService: CourseService,
  ) {}

  @FieldResolver(() => Course, { nullable: true })
  async course(
    @Root() userCourse: UserCourse,
    @Info() info: GraphQLResolveInfo,
    @Loader(LOADER_TYPES.CourseLoader)
    loader: CourseLoader,
  ): Promise<Course> {
    return loader.load({
      id: userCourse.courseId,
      fields: this.courseService.getFieldList(info),
    });
  }

  @Authorized()
  @CourseNotPublic()
  @UserAlreadyRegisteredCourse()
  @Mutation(() => UserCourseOrError)
  async startCourse(
    @Arg('data') data: CreateUserCourseInput,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<typeof UserCourseOrError> {
    return this.userCourseService.create(data, info, ctx);
  }
}
