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
import { QuizQuestion } from './entities/quiz-question.entity';
import { QuizQuestionService } from './services/quiz-question.service';
import { QuizQuestionConnection } from './types/quiz.connection';
import { QuizQuestionArgs } from './types/quiz-question.args';
import { QuizQuestionWhereInput } from './types/quiz-question-where.input';
import { QuizAnswer } from '../quiz-answer/entities/quiz-answer.entity';
import { LOADER_TYPES } from '../core/dataloader/loader-types';
import { Loader } from '../core/decorators/loader.decorator';
import { QuizAnswerService } from '../quiz-answer/services/quiz-answer.service';
import { QuizAnswerByQuestionIdLoader } from './services/quiz-answer-by-question-id.loader';
import { QuizQuestionRelayConnection } from './types/quiz-question.relay-connection';

@injectable()
@Resolver(() => QuizQuestion)
export class QuizQuestionResolver {
  constructor(
    private quizQuestionService: QuizQuestionService,
    private quizAnswerService: QuizAnswerService,
  ) {}

  @FieldResolver(() => [QuizAnswer], { nullable: true })
  async answers(
    @Root() quizAnswer: QuizAnswer,
    @Info() info: GraphQLResolveInfo,
    @Loader(LOADER_TYPES.QuizAnswerByQuestionIdLoader)
    loader: QuizAnswerByQuestionIdLoader,
  ): Promise<QuizAnswer[]> {
    return loader.load({
      id: quizAnswer.id,
      fields: this.quizAnswerService.getFieldList(info),
    });
  }

  @Query(() => QuizQuestionConnection)
  quizQuestionConnection(
    @Args() args: QuizQuestionArgs,
  ): QuizQuestionConnection {
    return new QuizQuestionConnection(args);
  }

  @Query(() => QuizQuestion, { nullable: true })
  async quizQuestion(
    @Arg('where') where: QuizQuestionWhereInput,
    @Info() info: GraphQLResolveInfo,
  ): Promise<QuizQuestion> {
    return this.quizQuestionService.getOne(where, info);
  }

  @Query(() => [QuizQuestion])
  async quizQuestions(
    @Args() args: QuizQuestionArgs,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<QuizQuestion[]> {
    _.merge(args, {
      where: {
        userId: ctx?.user?.id,
        roleId: ctx?.user?.roleId,
      },
    });
    return this.quizQuestionService.getMany(args, info, ctx);
  }

  @Query(() => QuizQuestionRelayConnection)
  async quizQuestionsRelay(
    @Args() args: QuizQuestionArgs,
    @Ctx() ctx: Context,
  ): Promise<QuizQuestionRelayConnection> {   
    _.merge(args, {
      where: {
        userId: ctx?.user?.id,
        roleId: ctx?.user?.roleId,
      },
    });
    return this.quizQuestionService.getManyRelay(args, ctx);
  }
}
