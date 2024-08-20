import { Resolver, Mutation, Arg, Ctx, Authorized, Info } from 'type-graphql';
import { injectable } from 'inversify';

import { Context } from '../core/types/context';
import { GraphQLResolveInfo } from 'graphql';
import { UserQuiz } from './entities/user-quiz.entity';
import { UserQuizService } from './services/user-quiz.service';
import { UserQuizOrError } from './types/user-quiz-or-error';
import { InsertUserQuizInput } from './types/insert-user-quiz.input';
import { UserAlreadyStartedQuiz } from './shared/user-already-started-quiz.guard';
import { QuizNotPublic } from './shared/quiz-not-public.guard';

@injectable()
@Resolver(() => UserQuiz)
export class UserQuizMutationResolver {
  constructor(private userQuizService: UserQuizService) {}

  @Authorized()
  @UserAlreadyStartedQuiz()
  @QuizNotPublic()
  @Mutation(() => UserQuizOrError)
  async createUserQuiz(
    @Arg('data') data: InsertUserQuizInput,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<typeof UserQuizOrError> {
    return this.userQuizService.create(data, info, ctx);
  }
}
