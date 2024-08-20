import { ContainerModule, interfaces } from 'inversify';
import { LOADER_TYPES } from '../core/dataloader/loader-types';
import { createUserQuizAnswerLoader } from './services/user-quiz-answer-by-id.loader';
import { UserQuizAnswerService } from './services/user-quiz-answer.service';
import { UserQuizAnswerAggreateResolver } from './user-quiz-answer-aggregate.resolver';
import { UserQuizAnswerMutationResolver } from './user-quiz-answer-mutation.resolver';
import { UserQuizAnswerEdgeResolver } from './user-quiz-answer-relay-edge.resolver';
import { UserQuizAnswerResolver } from './user-quiz-answer.resolver';

export const UserQuizAnswerModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(UserQuizAnswerService)
    .toSelf()
    .inSingletonScope();
  bind(UserQuizAnswerResolver)
    .toSelf()
    .inSingletonScope();
  bind(UserQuizAnswerMutationResolver)
    .toSelf()
    .inSingletonScope();
  bind(UserQuizAnswerEdgeResolver)
    .toSelf()
    .inSingletonScope();
  bind(UserQuizAnswerAggreateResolver)
    .toSelf()
    .inSingletonScope(); 
  bind(LOADER_TYPES.UserQuizAnswerLoader).toDynamicValue(() =>
    createUserQuizAnswerLoader(),
  );
});
