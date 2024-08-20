import { ContainerModule, interfaces } from 'inversify';
import { LOADER_TYPES } from '../core/dataloader/loader-types';
import { QuizAnswerAggreateResolver } from './quiz-answer-aggregate.resolve';
import { QuizAnswerEdgeResolver } from './quiz-answer-relay-edge.resolver';
import { QuizAnswerResolver } from './quiz-answer.resolve';
import { createQuizAnswerLoader } from './services/quiz-answer-by-id.loader';
import { QuizAnswerService } from './services/quiz-answer.service';

export const QuizAnswerModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(QuizAnswerService)
    .toSelf()
    .inSingletonScope();
  bind(QuizAnswerResolver)
    .toSelf()
    .inSingletonScope();
  bind(QuizAnswerEdgeResolver)
    .toSelf()
    .inSingletonScope();
  bind(QuizAnswerAggreateResolver)
    .toSelf()
    .inSingletonScope();
  bind(LOADER_TYPES.QuizAnswerLoader).toDynamicValue(() => createQuizAnswerLoader());
 
});
