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
import { Quiz } from './entities/quiz.entity';
import { QuizService } from './services/quiz.service';
import { QuizArgs } from './types/quiz.args';
import { QuizWhereInput } from './types/quiz-where.input';
import { QuizConnection } from './types/quiz.connection';
import { QuizQuestion } from '../quiz-question/entities/quiz-question.entity';
import { LOADER_TYPES } from '../core/dataloader/loader-types';
import { Loader } from '../core/decorators/loader.decorator';
import { QuizQuestionByQuizIdLoader } from './services/quiz-question-by-quiz-id.loader';
import { QuizQuestionService } from '../quiz-question/services/quiz-question.service';
import { QuizRelayConnection } from './types/quiz.relay-connection';

@injectable()
@Resolver(() => Quiz)
export class QuizResolver {
  constructor(
    private quizService: QuizService,
    private quizQuestionService: QuizQuestionService,
  ) {}

  @FieldResolver(() => [QuizQuestion], { nullable: true })
  async questions(
    @Root() quiz: Quiz,
    @Info() info: GraphQLResolveInfo,
    @Loader(LOADER_TYPES.QuizQuestionByQuizIdLoader)
    loader: QuizQuestionByQuizIdLoader,
  ): Promise<QuizQuestion[]> {
    return loader.load({
      id: quiz.id,
      fields: this.quizQuestionService.getFieldList(info),
    });
  }

  @Query(() => QuizConnection)
  quizConnection(@Args() args: QuizArgs): QuizConnection {   
    return new QuizConnection(args);
  }

  @Query(() => Quiz, { nullable: true })
  async quiz(
    @Arg('where') where: QuizWhereInput,
    @Info() info: GraphQLResolveInfo,
  ): Promise<Quiz> {
    return this.quizService.getOne(where, info);
  }

  @Query(() => [Quiz])
  async quizzes(
    @Args() args: QuizArgs,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<Quiz[]> {
    _.merge(args, {
      where: {
        userId: ctx?.user?.id,
        roleId: ctx?.user?.roleId,
      },
    });
    return this.quizService.getMany(args, info, ctx);
  }

  @Query(() => QuizRelayConnection)
  async quizzesRelay(
    @Args() args: QuizArgs,
    @Ctx() ctx: Context,
  ): Promise<QuizRelayConnection> {
    _.merge(args, {
      where: {
        userId: ctx?.user?.id,
        roleId: ctx?.user?.roleId,
      },
    });
    return this.quizService.getManyRelay(args, ctx);
  }
}
