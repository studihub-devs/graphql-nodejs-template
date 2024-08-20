import { injectable } from 'inversify';
import {
  Arg,
  Args,
  Ctx,
  FieldResolver,
  Info,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { GraphQLResolveInfo } from 'graphql';
import _ from 'lodash';
import { Context } from '../core/types/context';
import { CourseContent } from './entities/course-content.entity';
import { CourseContentService } from './services/course-content.service';
import { CourseContentArgs } from './types/course-content.args';
import { CourseContentConnection } from './types/course-content.connection';
import { Loader } from '../core/decorators/loader.decorator';
import { LOADER_TYPES } from '../core/dataloader/loader-types';
import { Quiz } from '../quiz/entities/quiz.entity';
import { QuizByCourseContentIdLoader } from './services/quiz-by-course-content-id.loader';
import { QuizService } from '../quiz/services/quiz.service';
import { S3File } from '../s3-file/entities/s3-file.entity';
import { S3FileLoader } from '../s3-file/services/s3-file-by-id.loader';
import { S3FileService } from '../s3-file/services/s3-file.service';
import { CourseContentWhereInput } from './types/course-content-where.input';
import { CourseContentRelayConnection } from './types/course-content.relay-connection';
import { ChildContentByCourseContentIdLoader } from './services/child-course-content-by-course-id.loader';
import { QuizArgs } from '../quiz/types/quiz.args';

@injectable()
@Resolver(() => CourseContent)
export class CourseContentResolver {
  constructor(
    private courseContentService: CourseContentService,    
    private quizService: QuizService,
    private s3FileService: S3FileService,
  ) {}

  @FieldResolver(() => [CourseContent], { nullable: true })
  async childContents(
    @Root() content: CourseContent,
    @Info() info: GraphQLResolveInfo,
    @Loader(LOADER_TYPES.ChildContentByCourseContentIdLoader)
    loader: ChildContentByCourseContentIdLoader,
  ): Promise<CourseContent[]> {
    return loader.load({
      id: content.id,
      fields: this.courseContentService.getFieldList(info),
    });
  }

  @FieldResolver(() => S3File, { nullable: true })
  async video(
    @Root() content: CourseContent,
    @Info() info: GraphQLResolveInfo,
    @Loader(LOADER_TYPES.S3FileLoader)
    loader: S3FileLoader,
  ): Promise<S3File> {
    if(!content?.videoId) {
      return null;
    }
    return loader.load({
      id: content.videoId,
      fields: this.s3FileService.getFieldList(info),
    });
  }

  @FieldResolver(() => S3File, { nullable: true })
  async file(
    @Root() content: CourseContent,
    @Info() info: GraphQLResolveInfo,
    @Loader(LOADER_TYPES.S3FileLoader)
    loader: S3FileLoader,
  ): Promise<S3File> {
    if(!content?.fileId) {
      return null;
    }
    return loader.load({
      id: content.fileId,
      fields: this.s3FileService.getFieldList(info),
    });
  }

  @FieldResolver(() => [Quiz], { nullable: true })
  async quizzes(
    @Root() content: CourseContent,
    @Info() info: GraphQLResolveInfo,
    @Loader(LOADER_TYPES.QuizByCourseContentIdLoader)
    loader: QuizByCourseContentIdLoader,
    @Args() args: QuizArgs,
    @Ctx() ctx: Context,
  ): Promise<Quiz[]> {
    _.merge(args, {
      where: {
        userId: ctx?.user?.id,
        roleId: ctx?.user?.roleId,
      },
    });
    return loader.load({
      id: content.id,
      fields: this.quizService.getFieldList(info, { prefix: 'q'}),
      args,
    });
  }

  @Query(() => CourseContentConnection)
  courseContentConnection(
    @Args() args: CourseContentArgs,
  ): CourseContentConnection {
    return new CourseContentConnection(args);
  }

  @Query(() => [CourseContent])
  async courseContents(
    @Args() args: CourseContentArgs,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<CourseContent[]> {
    _.merge(args, {
      where: {
        userId: ctx?.user?.id,
        roleId: ctx?.user?.roleId,
      },
    });
    return this.courseContentService.getMany(args, info, ctx);
  }

  @Query(() => CourseContent, { nullable: true })
  async courseContent(
    @Arg('where') where: CourseContentWhereInput,
    @Info() info: GraphQLResolveInfo,
  ): Promise<CourseContent> {
    return this.courseContentService.getOne(where, info);
  }

  @Query(() => CourseContentRelayConnection)
  async courseContentsRelay(
    @Args() args: CourseContentArgs,
    @Ctx() ctx: Context,
  ): Promise<CourseContentRelayConnection> {
    _.merge(args, {
      where: {
        userId: ctx?.user?.id,
        roleId: ctx?.user?.roleId,
      },
    });
    return this.courseContentService.getManyRelay(args, ctx);
  }
}
