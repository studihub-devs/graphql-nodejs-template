import { GraphQLResolveInfo } from 'graphql';
import { injectable } from 'inversify';
import _ from 'lodash';
import { S3File } from '../s3-file/entities/s3-file.entity';
import { S3FileLoader } from '../s3-file/services/s3-file-by-id.loader';
import {
  Arg,
  Args,
  Authorized,
  Ctx,
  FieldResolver,
  Info,  
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { LOADER_TYPES } from '../core/dataloader/loader-types';
import { Loader } from '../core/decorators/loader.decorator';
import { Context } from '../core/types/context';
import { CourseContent } from '../course-content/entities/course-content.entity';
import { CourseReact } from '../course-react/entities/course-react.entity';
import { CourseReactService } from '../course-react/services/course-react.service';
import { CourseContentService } from '../course-content/services/course-content.service';
import { CourseReview } from '../course-review/entities/course-review.entity';
import { CourseReviewService } from '../course-review/services/course-review.service';
import { User } from '../user/entities/user.entity';
import { UserLoader } from '../user/services/user-by-id.loader';
import { UserService } from '../user/services/user.service';
import { Course } from './entities/course.entity';
import { CourseContentByCourseIdLoader } from './services/course-content-by-course-id.loader';
import { CourseReactByCourseIdLoader } from './services/course-react-by-course-id.loader';
import { CourseReactCountLoader } from './services/course-react-count.loader';
import { AverageRatingByCourseIdLoader } from './services/course-review-average-rate.loader';
import { CourseReviewByCourseIdLoader } from './services/course-review-by-course-id.loader';
import { CourseReviewCountLoader } from './services/course-review-count.loader';
import { CourseService } from './services/course.service';
import { CourseWhereInput } from './types/course-where.input';
import { CourseArgs } from './types/course.args';
import { CourseConnection } from './types/course.connection';
import { CourseRelayConnection } from './types/course.relay-connection';
import { S3FileService } from '../s3-file/services/s3-file.service';
import { CourseViewership } from '../course-viewership/entities/course-viewership.entity';
import { CourseViewershipService } from '../course-viewership/services/course-viewership.service';
import { CourseViewershipByCourseIdLoader } from './services/course-viewership-by-course-id.loader';
import { CourseViewershipCountLoader } from './services/course-viewership-count.loader';
import { CourseContentArgs } from '../course-content/types/course-content.args';

@injectable()
@Resolver(() => Course)
export class CourseResolver {
  constructor(
    private courseService: CourseService,
    private userService: UserService,
    private courseContentService: CourseContentService,
    private courseReviewService: CourseReviewService,
    private courseReactService: CourseReactService,
    private s3FileService: S3FileService,
    private courseViewershipService: CourseViewershipService,
  ) {}

  @FieldResolver(() => S3File, { nullable: true })
  async thumbnail(
    @Root() course: Course,
    @Info() info: GraphQLResolveInfo,
    @Loader(LOADER_TYPES.S3FileLoader)
    loader: S3FileLoader,
  ): Promise<S3File> {
    if(!course.thumbnailId) {
      return null;
    }
    return loader.load({
      id: course.thumbnailId,
      fields: this.s3FileService.getFieldList(info),
    });
  }

  @FieldResolver(() => S3File, { nullable: true })
  async badgeImage(
    @Root() course: Course,
    @Info() info: GraphQLResolveInfo,
    @Loader(LOADER_TYPES.S3FileLoader)
    loader: S3FileLoader,
  ): Promise<S3File> {
    if(!course?.badgeImageId) {
      return null;
    }
    return loader.load({
      id: course.badgeImageId,
      fields: this.s3FileService.getFieldList(info),
    });
  }    

  @FieldResolver(() => [CourseContent], { nullable: true })
  async contents(
    @Root() course: Course,
    @Info() info: GraphQLResolveInfo,
    @Loader(LOADER_TYPES.CourseContentByCourseIdLoader)
    loader: CourseContentByCourseIdLoader,
    @Args() args: CourseContentArgs,
    @Ctx() ctx: Context,
  ): Promise<CourseContent[]> {
    _.merge(args, {
      where: {
        userId: ctx?.user?.id,
        roleId: ctx?.user?.roleId,
      },
    });
    return loader.load({
      id: course.id,
      fields: this.courseContentService.getFieldList(info),
      args,
    });
  }

  @FieldResolver(() => [CourseReview], { nullable: true })
  async reviews(
    @Root() course: Course,
    @Info() info: GraphQLResolveInfo,
    @Loader(LOADER_TYPES.CourseReviewByCourseIdLoader)
    loader: CourseReviewByCourseIdLoader,
  ): Promise<CourseReview[]> {
    return loader.load({
      id: course.id,
      fields: this.courseReviewService.getFieldList(info),
    });
  }

  @FieldResolver(() => [CourseReact], { nullable: true })
  async reacts(
    @Root() course: Course,
    @Info() info: GraphQLResolveInfo,
    @Loader(LOADER_TYPES.CourseReactByCourseIdLoader)
    loader: CourseReactByCourseIdLoader,
  ): Promise<CourseReact[]> {
    return loader.load({
      id: course.id,
      fields: this.courseReactService.getFieldList(info),
    });
  }

  @FieldResolver(() => [CourseViewership], { nullable: true })
  async viewerships(
    @Root() course: Course,
    @Info() info: GraphQLResolveInfo,
    @Loader(LOADER_TYPES.CourseViewershipByCourseIdLoader)
    loader: CourseViewershipByCourseIdLoader,
  ): Promise<CourseViewership[]> {
    return loader.load({
      id: course.id,
      fields: this.courseViewershipService.getFieldList(info),
    });
  }

  @FieldResolver(() => Number, { nullable: true })
  async averageRating(
    @Root() course: Course,
    @Info() info: GraphQLResolveInfo,
    @Loader(LOADER_TYPES.AverageRatingByCourseIdLoader)
    loader: AverageRatingByCourseIdLoader,
  ): Promise<number> {
    return loader.load({ id: course.id });
  }

  @FieldResolver(() => Number)
  async reviewCount(
    @Root() course: Course,
    @Loader(LOADER_TYPES.CourseReviewCountLoader)
    loader: CourseReviewCountLoader,
  ): Promise<number> {
    return loader.load({ courseId: course.id });
  }

  @FieldResolver(() => Number)
  async reactCount(
    @Root() course: Course,
    @Loader(LOADER_TYPES.CourseReactCountLoader)
    loader: CourseReactCountLoader,
  ): Promise<number> {
    return loader.load({ courseId: course.id });
  }

  @FieldResolver(() => Number)
  async viewershipCount(
    @Root() course: Course,
    @Loader(LOADER_TYPES.CourseViewershipCountLoader)
    loader: CourseViewershipCountLoader,
  ): Promise<number> {
    return loader.load({ courseId: course.id });
  }

  @FieldResolver(() => User, { nullable: true })
  async teacher(
    @Root() course: Course,
    @Info() info: GraphQLResolveInfo,
    @Loader(LOADER_TYPES.UserLoader) userLoader: UserLoader,
  ): Promise<User> {
    if (!course?.teacherId) {
      return null;
    }
    return userLoader.load({
      id: course.teacherId,
      fields: this.userService.getFieldList(info),
    });
  }

  @Query(() => CourseConnection)
  courseConnection(@Args() args: CourseArgs): CourseConnection {
    return new CourseConnection(args);
  }

  @Query(() => Course, { nullable: true })
  async course(
    @Arg('where') where: CourseWhereInput,
    @Info() info: GraphQLResolveInfo,
  ): Promise<Course> {
    return this.courseService.getOne(where, info);
  }

  @Query(() => [Course])
  async courses(
    @Args() args: CourseArgs,
    @Ctx() ctx: Context,
    @Info() info: GraphQLResolveInfo,
  ): Promise<Course[]> {
    return this.courseService.getMany(args, ctx, info);
  }

  @Query(() => CourseRelayConnection)
  async coursesRelay(
    @Args() args: CourseArgs,
    @Ctx() ctx: Context,
  ): Promise<CourseRelayConnection> {
    return this.courseService.getManyRelay(args, ctx);
  }

  @Authorized()
  @Query(() => CourseRelayConnection)
  async myCoursesRelay(
    @Args() args: CourseArgs,
    @Ctx() ctx: Context,
    @Info() info: GraphQLResolveInfo,
  ): Promise<CourseRelayConnection> {
    _.merge(args, {
      where: {
        userId: ctx?.user?.id,
        roleId: ctx?.user?.roleId,
      },
    });

    return this.courseService.getManyRelay(args, ctx);
  }
}
