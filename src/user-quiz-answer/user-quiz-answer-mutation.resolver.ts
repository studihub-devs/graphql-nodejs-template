import { Resolver, Mutation, Arg, Ctx, Authorized, Info } from 'type-graphql';
import { injectable } from 'inversify';

import { Context } from '../core/types/context';
import { GraphQLResolveInfo } from 'graphql';
import { UserQuizAnswer } from './entities/user-quiz-answer.entity';
import { UserQuizAnswerOrError } from './types/user-quiz-answer-or-error';
import { InsertUserQuizAnswerInput } from './types/insert-user-quiz-answer.input';
import { UserQuizAnswerService } from './services/user-quiz-answer.service';
import { QuizNotPublic } from './shared/quiz-not-public.guard';

@injectable()
@Resolver(() => UserQuizAnswer)
export class UserQuizAnswerMutationResolver {
  constructor(private userQuizAnswerService: UserQuizAnswerService) {}

  @Authorized()  
  @QuizNotPublic()
  @Mutation(() => UserQuizAnswerOrError)
  async createUserQuizAnswer(
    @Arg('data') data: InsertUserQuizAnswerInput,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<typeof UserQuizAnswerOrError> {
    return this.userQuizAnswerService.create(data, info, ctx);
  }
}
