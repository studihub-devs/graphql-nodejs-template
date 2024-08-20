import { injectable } from 'inversify';
import { FieldResolver, Resolver, Int, Root } from 'type-graphql';
import { QuizQuestionService } from './services/quiz-question.service';
import { QuizQuestionConnectionAggregate } from './types/quiz-question.aggregate-connection';

@injectable()
@Resolver(() => QuizQuestionConnectionAggregate)
export class QuizQuestionAggreateResolver {
  constructor(private quizQuestionService: QuizQuestionService) {}

  @FieldResolver(() => Int)
  async count(
    @Root() aggregate: QuizQuestionConnectionAggregate,
  ): Promise<number> {
    return this.quizQuestionService.getCount(aggregate.args);
  }
}
