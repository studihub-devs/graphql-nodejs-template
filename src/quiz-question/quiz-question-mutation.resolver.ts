import { Resolver, Mutation, Arg, Ctx, Authorized, Info } from 'type-graphql';
import { injectable } from 'inversify';

import { Context } from '../core/types/context';
import { GraphQLResolveInfo } from 'graphql';
import { QuizQuestion } from './entities/quiz-question.entity';
import { QuizQuestionService } from './services/quiz-question.service';
import { CanMutateQuizQuestion } from './shared/can-mutate-quiz-question.guard';
import { QuizQuestionOrError } from './types/quiz-question-or-error';
import { InsertQuizQuestionInput } from './types/insert-quiz-question.input';
import { UpdateQuizQuestionInput } from './types/update-quiz-question.input';
import { QuizQuestionWhereInput } from './types/quiz-question-where.input';
import { UpdateQuizQuestionSeqInput } from './types/update-quiz-question-seq.input';

@injectable()
@Resolver(() => QuizQuestion)
export class QuizQuestionMutationResolver {
  constructor(private quizQuestionService: QuizQuestionService) {}

  @Authorized()
  @CanMutateQuizQuestion()
  @Mutation(() => QuizQuestionOrError)
  async createQuizQuestion(
    @Arg('data') data: InsertQuizQuestionInput,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<typeof QuizQuestionOrError> {
    return this.quizQuestionService.create(data, info, ctx);
  }

  @Authorized()
  @CanMutateQuizQuestion()
  @Mutation(() => QuizQuestionOrError)
  async updateQuizQuestion(
    @Arg('data') data: UpdateQuizQuestionInput,
    @Arg('where') where: QuizQuestionWhereInput,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<typeof QuizQuestionOrError> {
    return this.quizQuestionService.update(data, where, info, ctx);
  }

  @Authorized()
  @CanMutateQuizQuestion()
  @Mutation(() => QuizQuestionOrError)
  async deleteQuizQuestion(
    @Arg('where') where: QuizQuestionWhereInput,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<typeof QuizQuestionOrError> {
    return this.quizQuestionService.delete(where, info, ctx);
  }

  @Authorized()
  @CanMutateQuizQuestion()
  @Mutation(() => QuizQuestionOrError)
  async mutateSeqCourseContent(
    @Arg('data', () => [UpdateQuizQuestionSeqInput]) 
      data: UpdateQuizQuestionSeqInput[],    
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<typeof QuizQuestionOrError> {
    return this.quizQuestionService.mutateSeq(data, info, ctx);
  }
}
