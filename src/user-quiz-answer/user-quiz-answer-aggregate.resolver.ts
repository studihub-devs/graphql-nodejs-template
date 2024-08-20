import { injectable } from 'inversify';
import { FieldResolver, Resolver, Int, Root } from 'type-graphql';
import { UserQuizAnswerService } from './services/user-quiz-answer.service';
import { UserQuizAnswerConnectionAggregate } from './types/user-quiz-answer.aggregate-connection';

@injectable()
@Resolver(() => UserQuizAnswerConnectionAggregate)
export class UserQuizAnswerAggreateResolver {
  constructor(private userQuizAnswerService: UserQuizAnswerService) {}

  @FieldResolver(() => Int)
  async count(@Root() aggregate: UserQuizAnswerConnectionAggregate): Promise<number> {
    return this.userQuizAnswerService.getCount(aggregate.args);
  }
}
