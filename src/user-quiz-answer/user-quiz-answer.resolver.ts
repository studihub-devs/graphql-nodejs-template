import { injectable } from 'inversify';
import {
  Arg,
  Args,
  Ctx, 
  Info,
  Query,
  Resolver,  
} from 'type-graphql';
import { GraphQLResolveInfo } from 'graphql';
import _ from 'lodash';
import { Context } from '../core/types/context';
import { UserQuizAnswer } from './entities/user-quiz-answer.entity';
import { UserQuizAnswerConnection } from './types/user-quiz-answer.connection';
import { UserQuizAnswerArgs } from './types/user-quiz-answer.args';
import { UserQuizAnswerWhereInput } from './types/user-quiz-answer-where.input';
import { UserQuizAnswerRelayConnection } from './types/user-quiz-answer.relay-connection';
import { UserQuizAnswerService } from './services/user-quiz-answer.service';

@injectable()
@Resolver(() => UserQuizAnswer)
export class UserQuizAnswerResolver {
  constructor(
    private userQuizAnswerService: UserQuizAnswerService,   
  ) {} 

  @Query(() => UserQuizAnswerConnection)
  userQuizAnswerConnection(@Args() args: UserQuizAnswerArgs): UserQuizAnswerConnection {   
    return new UserQuizAnswerConnection(args);
  }

  @Query(() => UserQuizAnswer, { nullable: true })
  async userQuizAnswer(
    @Arg('where') where: UserQuizAnswerWhereInput,
    @Info() info: GraphQLResolveInfo,
  ): Promise<UserQuizAnswer> {
    return this.userQuizAnswerService.getOne(where, info);
  }

  @Query(() => [UserQuizAnswer])
  async userQuizAnswers(
    @Args() args: UserQuizAnswerArgs,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<UserQuizAnswer[]> {
    _.merge(args, {
      where: {
        userId: ctx?.user?.id,
        roleId: ctx?.user?.roleId,
      },
    });
    return this.userQuizAnswerService.getMany(args, info, ctx);
  }

  @Query(() => UserQuizAnswerRelayConnection)
  async userQuizAnswersRelay(
    @Args() args: UserQuizAnswerArgs,
    @Ctx() ctx: Context,
  ): Promise<UserQuizAnswerRelayConnection> {
    _.merge(args, {
      where: {
        userId: ctx?.user?.id,
        roleId: ctx?.user?.roleId,
      },
    });
    return this.userQuizAnswerService.getManyRelay(args, ctx);
  }
}
