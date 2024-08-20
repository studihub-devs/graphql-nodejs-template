import { injectable } from 'inversify';
import { Arg, Args, Ctx, Info, Query, Resolver } from 'type-graphql';
import { GraphQLResolveInfo } from 'graphql';
import _ from 'lodash';
import { Context } from '../core/types/context';
import { QuizAnswer } from './entities/quiz-answer.entity';
import { QuizAnswerService } from './services/quiz-answer.service';
import { QuizAnswerConnection } from './types/quiz-answer.connection';
import { QuizAnswerArgs } from './types/quiz-answer.args';
import { QuizAnswerWhereInput } from './types/quiz-answer-where.input';

@injectable()
@Resolver(() => QuizAnswer)
export class QuizAnswerResolver {
  constructor(private quizAnswerService: QuizAnswerService) {}

  @Query(() => QuizAnswerConnection)
  quizAnswerConnection(@Args() args: QuizAnswerArgs): QuizAnswerConnection {
    return new QuizAnswerConnection(args);
  }

  @Query(() => QuizAnswer, { nullable: true })
  async quizAnswer(
    @Arg('where') where: QuizAnswerWhereInput,
    @Info() info: GraphQLResolveInfo,
  ): Promise<QuizAnswer> {
    return this.quizAnswerService.getOne(where, info);
  }

  @Query(() => [QuizAnswer])
  async quizAnswers(
    @Args() args: QuizAnswerArgs,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<QuizAnswer[]> {
    return this.quizAnswerService.getMany(args, info, ctx);
  }
}
