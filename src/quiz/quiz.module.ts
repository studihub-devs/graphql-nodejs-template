import { ContainerModule, interfaces } from 'inversify';
import { LOADER_TYPES } from '../core/dataloader/loader-types';
import { QuizAggreateResolver } from './quiz-aggregate.resolver';
import { QuizMutationResolver } from './quiz-mutation.resolver';
import { QuizEdgeResolver } from './quiz-relay-edge.resolver';
import { QuizResolver } from './quiz.resolve';
import { createQuizLoader } from './services/quiz-by-id.loader';
import { createQuizQuestionByQuizIdLoader } from './services/quiz-question-by-quiz-id.loader';
import { QuizService } from './services/quiz.service';

export const QuizModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(QuizService)
    .toSelf()
    .inSingletonScope();
  bind(QuizResolver)
    .toSelf()
    .inSingletonScope();
  bind(QuizMutationResolver)
    .toSelf()
    .inSingletonScope();
  bind(QuizEdgeResolver)
    .toSelf()
    .inSingletonScope();
  bind(QuizAggreateResolver)
    .toSelf()
    .inSingletonScope();
  bind(LOADER_TYPES.QuizQuestionByQuizIdLoader).toDynamicValue(() =>
    createQuizQuestionByQuizIdLoader(),
  );
  bind(LOADER_TYPES.QuizLoader).toDynamicValue(() =>
    createQuizLoader(),
  );
});
