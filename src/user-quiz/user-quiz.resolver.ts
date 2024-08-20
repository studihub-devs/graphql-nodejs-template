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
import { LOADER_TYPES } from '../core/dataloader/loader-types';
import { Loader } from '../core/decorators/loader.decorator';
import { UserQuiz } from './entities/user-quiz.entity';
import { UserService } from '../user/services/user.service';
import { QuizService } from '../quiz/services/quiz.service';
import { User } from '../user/entities/user.entity';
import { UserLoader } from '../user/services/user-by-id.loader';
import { Quiz } from '../quiz/entities/quiz.entity';
import { QuizLoader } from '../quiz/services/quiz-by-id.loader';
import { UserQuizConnection } from './types/user-quiz.connection';
import { UserQuizArgs } from './types/user-quiz.args';
import { UserQuizWhereInput } from './types/user-quiz-where.input';
import { UserQuizRelayConnection } from './types/user-quiz.relay-connection';
import { UserQuizService } from './services/user-quiz.service';

@injectable()
@Resolver(() => UserQuiz)
export class UserQuizResolver {
  constructor(
    private userQuizService: UserQuizService,
    private userService: UserService, 
    private quizService: QuizService,   
  ) {}

  @FieldResolver(() => User, { nullable: true })
  async learner(
    @Root() userQuiz: UserQuiz,
    @Info() info: GraphQLResolveInfo,
    @Loader(LOADER_TYPES.UserLoader)
    loader: UserLoader,
  ): Promise<User> {
    return loader.load({
      id: userQuiz.userId,
      fields: this.userService.getFieldList(info),
    });
  }

  @FieldResolver(() => Quiz, { nullable: true })
  async quiz(
    @Root() userQuiz: UserQuiz,
    @Info() info: GraphQLResolveInfo,
    @Loader(LOADER_TYPES.QuizLoader)
    loader: QuizLoader,
  ): Promise<Quiz> {
    return loader.load({
      id: userQuiz.quizId,
      fields: this.quizService.getFieldList(info),
    });
  }

  @Query(() => UserQuizConnection)
  userQuizConnection(@Args() args: UserQuizArgs): UserQuizConnection {   
    return new UserQuizConnection(args);
  }

  @Query(() => UserQuiz, { nullable: true })
  async userQuiz(
    @Arg('where') where: UserQuizWhereInput,
    @Info() info: GraphQLResolveInfo,
  ): Promise<UserQuiz> {
    return this.userQuizService.getOne(where, info);
  }

  @Query(() => [UserQuiz])
  async userQuizzes(
    @Args() args: UserQuizArgs,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<UserQuiz[]> {
    _.merge(args, {
      where: {
        userId: ctx?.user?.id,
        roleId: ctx?.user?.roleId,
      },
    });
    return this.userQuizService.getMany(args, info, ctx);
  }

  @Query(() => UserQuizRelayConnection)
  async userQuizzesRelay(
    @Args() args: UserQuizArgs,
    @Ctx() ctx: Context,
  ): Promise<UserQuizRelayConnection> {
    _.merge(args, {
      where: {
        userId: ctx?.user?.id,
        roleId: ctx?.user?.roleId,
      },
    });
    return this.userQuizService.getManyRelay(args, ctx);
  }
}
