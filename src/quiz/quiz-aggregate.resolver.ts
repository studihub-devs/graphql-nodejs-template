import { injectable } from 'inversify';
import { FieldResolver, Resolver, Int, Root } from 'type-graphql';
import { QuizService } from './services/quiz.service';
import { QuizConnectionAggregate } from './types/quiz.aggregate-connection';

@injectable()
@Resolver(() => QuizConnectionAggregate)
export class QuizAggreateResolver {
  constructor(private quizService: QuizService) {}

  @FieldResolver(() => Int)
  async count(@Root() aggregate: QuizConnectionAggregate): Promise<number> {
    return this.quizService.getCount(aggregate.args);
  }
}
