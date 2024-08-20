import { ContainerModule, interfaces } from 'inversify';
import { LOADER_TYPES } from '../core/dataloader/loader-types';
import { QuizQuestionAggreateResolver } from './quiz-question-aggregate.resolve';
import { QuizQuestionMutationResolver } from './quiz-question-mutation.resolver';
import { QuizQuestionEdgeResolver } from './quiz-question-relay-edge.resolver';
import { QuizQuestionResolver } from './quiz-question.resolve';
import { createQuizAnswerByQuestionIdLoader } from './services/quiz-answer-by-question-id.loader';
import { createQuizQuestionLoader } from './services/quiz-question-by-id.loader';
import { QuizQuestionService } from './services/quiz-question.service';

export const QuizQuestionModule = new ContainerModule(
  (bind: interfaces.Bind) => {
    bind(QuizQuestionService)
      .toSelf()
      .inSingletonScope();
    bind(QuizQuestionResolver)
      .toSelf()
      .inSingletonScope();
    bind(QuizQuestionMutationResolver)
      .toSelf()
      .inSingletonScope();
    bind(QuizQuestionEdgeResolver)
      .toSelf()
      .inSingletonScope();
    bind(QuizQuestionAggreateResolver)
      .toSelf()
      .inSingletonScope();
    bind(LOADER_TYPES.QuizAnswerByQuestionIdLoader).toDynamicValue(() =>
      createQuizAnswerByQuestionIdLoader(),
    );
    bind(LOADER_TYPES.QuizQuestionLoader).toDynamicValue(() =>
      createQuizQuestionLoader(),
    );
  },
);
