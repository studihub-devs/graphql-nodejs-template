import { injectable } from 'inversify';
import { FieldResolver, Resolver, Int, Root } from 'type-graphql';
import { UserQuizService } from './services/user-quiz.service';
import { UserQuizConnectionAggregate } from './types/user-quiz.aggregate-connection';

@injectable()
@Resolver(() => UserQuizConnectionAggregate)
export class UserQuizAggreateResolver {
  constructor(private userQuizService: UserQuizService) {}

  @FieldResolver(() => Int)
  async count(@Root() aggregate: UserQuizConnectionAggregate): Promise<number> {
    return this.userQuizService.getCount(aggregate.args);
  }
}
