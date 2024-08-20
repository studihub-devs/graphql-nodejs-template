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
import { CourseReview } from './entities/course-review.entity';
import { CourseReviewService } from './services/course-review.service';
import { CourseNotPublic } from './shared/course-not-public.guard';
import { CreateCourseReviewInput } from './types/course-review-create.input';
import { CourseReviewOrError } from './types/course-review-or-error';
import { CourseReviewArgs } from './types/course-review.args';
import { CourseReviewConnection } from './types/course-review.connection';
import { UserService } from '../user/services/user.service';

@injectable()
@Resolver(() => CourseReview)
export class CourseReviewResolver {
  constructor(
    private courseReviewService: CourseReviewService,
    private courseService: CourseService,
    private userService: UserService,
  ) {}

  @FieldResolver(() => Course, { nullable: true })
  async course(
    @Root() courseReview: CourseReview,
    @Info() info: GraphQLResolveInfo,
    @Loader(LOADER_TYPES.CourseLoader)
    loader: CourseLoader,
  ): Promise<Course> {
    return loader.load({
      id: courseReview.courseId,
      fields: this.courseService.getFieldList(info),
    });
  }

  @FieldResolver(() => User, { nullable: true })
  async user(
    @Root() courseReview: CourseReview,
    @Info() info: GraphQLResolveInfo,
    @Loader(LOADER_TYPES.UserLoader) userLoader: UserLoader,
  ): Promise<User> {
    if (!courseReview?.userId) {
      return null;
    }
    return userLoader.load({
      id: courseReview.userId,
      fields: this.userService.getFieldList(info),
    });
  }

  @Authorized()
  @CourseNotPublic()
  @Mutation(() => CourseReviewOrError)
  async reviewCourse(
    @Arg('data') data: CreateCourseReviewInput,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<typeof CourseReviewOrError> {
    return this.courseReviewService.create(data, info, ctx);
  }

  @Query(() => CourseReviewConnection)
  CourseReviewConnection(
    @Args() args: CourseReviewArgs,
  ): CourseReviewConnection {
    return new CourseReviewConnection(args);
  }

  @Query(() => [CourseReview])
  async courseReviews(
    @Args() args: CourseReviewArgs,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<CourseReview[]> {
    return this.courseReviewService.getMany(args, info, ctx);
  }
}
