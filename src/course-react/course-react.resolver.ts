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
import { UserLoader } from '../user/services/user-by-id.loader';
import { CourseReact } from './entities/course-react.entity';
import { CourseReactService } from './services/course-react.service';
import { CourseNotPublic } from './shared/course-not-public.guard';
import { CreateCourseReactInput } from './types/course-react-create.input';
import { CourseReactOrError } from './types/course-react-or-error';
import { CourseReactArgs } from './types/course-react.args';
import { CourseReactConnection } from './types/course-react.connection';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/services/user.service';

@injectable()
@Resolver(() => CourseReact)
export class CourseReactResolver {
  constructor(
    private courseReactService: CourseReactService,
    private courseService: CourseService,
    private userService: UserService,
  ) {}

  @FieldResolver(() => Course, { nullable: true })
  async course(
    @Root() courseReact: CourseReact,
    @Info() info: GraphQLResolveInfo,
    @Loader(LOADER_TYPES.CourseLoader)
    loader: CourseLoader,
  ): Promise<Course> {
    return loader.load({
      id: courseReact.courseId,
      fields: this.courseService.getFieldList(info),
    });
  }

  @FieldResolver(() => User, { nullable: true })
  async user(
    @Root() courseReact: CourseReact,
    @Info() info: GraphQLResolveInfo,
    @Loader(LOADER_TYPES.UserLoader) userLoader: UserLoader,
  ): Promise<User> {
    if (!courseReact?.userId) {
      return null;
    }
    return userLoader.load({
      id: courseReact.userId,
      fields: this.userService.getFieldList(info),
    });
  }

  @Authorized()
  @CourseNotPublic()
  @Mutation(() => CourseReactOrError)
  async reactCourse(
    @Arg('data') data: CreateCourseReactInput,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<typeof CourseReactOrError> {
    return this.courseReactService.create(data, info, ctx);
  }

  @Query(() => CourseReactConnection)
  CourseReactConnection(@Args() args: CourseReactArgs): CourseReactConnection {
    return new CourseReactConnection(args);
  }

  @Query(() => [CourseReact])
  async courseReacts(
    @Args() args: CourseReactArgs,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<CourseReact[]> {
    return this.courseReactService.getMany(args, info, ctx);
  }
}
