import { injectable } from 'inversify';
import { FieldResolver, Resolver, Int, Root } from 'type-graphql';
import { QuizAnswerService } from './services/quiz-answer.service';
import { QuizAnswerConnectionAggregate } from './types/quiz-answer.aggregate-connection';

@injectable()
@Resolver(() => QuizAnswerConnectionAggregate)
export class QuizAnswerAggreateResolver {
  constructor(private quizAnswerService: QuizAnswerService) {}

  @FieldResolver(() => Int)
  async count(
    @Root() aggregate: QuizAnswerConnectionAggregate,
  ): Promise<number> {
    return this.quizAnswerService.getCount(aggregate.args);
  }
}
