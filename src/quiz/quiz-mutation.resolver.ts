import { Resolver, Mutation, Arg, Ctx, Authorized, Info } from 'type-graphql';
import { injectable } from 'inversify';

import { Context } from '../core/types/context';
import { GraphQLResolveInfo } from 'graphql';
import { Quiz } from './entities/quiz.entity';
import { QuizService } from './services/quiz.service';
import { CanMutateQuiz } from './shared/can-mutate-quiz.guard';
import { InsertQuizInput } from './types/insert-quiz.input';
import { QuizOrError } from './types/quiz-or-error';
import { UpdateQuizInput } from './types/update-quiz.input';
import { QuizWhereInput } from './types/quiz-where.input';

@injectable()
@Resolver(() => Quiz)
export class QuizMutationResolver {
  constructor(private quizService: QuizService) {}

  @Authorized()
  @CanMutateQuiz()
  @Mutation(() => QuizOrError)
  async createQuiz(
    @Arg('data') data: InsertQuizInput,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<typeof QuizOrError> {
    return this.quizService.create(data, info, ctx);
  }

  @Authorized()
  @CanMutateQuiz()
  @Mutation(() => QuizOrError)
  async updateQuiz(
    @Arg('data') data: UpdateQuizInput,
    @Arg('where') where: QuizWhereInput,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<typeof QuizOrError> {
    return this.quizService.update(data, where, info, ctx);
  }

  @Authorized()
  @CanMutateQuiz()
  @Mutation(() => QuizOrError)
  async deleteQuiz(
    @Arg('where') where: QuizWhereInput,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<typeof QuizOrError> {
    return this.quizService.delete(where, info, ctx);
  }

  @Authorized()
  @Mutation(() => QuizOrError)
  async mutateStatusQuiz(
    @Arg('data') data: UpdateQuizInput,
    @Arg('where') where: QuizWhereInput,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<typeof QuizOrError> {
    return this.quizService.mutateStatus(data, where, info, ctx);
  }
}
