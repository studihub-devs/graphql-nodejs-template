import { ContainerModule, interfaces } from 'inversify';
import { LOADER_TYPES } from '../core/dataloader/loader-types';
import { createUserQuizLoader } from './services/user-quiz-by-id.loader';
import { UserQuizService } from './services/user-quiz.service';
import { UserQuizAggreateResolver } from './user-quiz-aggregate.resolver';
import { UserQuizMutationResolver } from './user-quiz-mutation.resolver';
import { UserQuizEdgeResolver } from './user-quiz-relay-edge.resolver';
import { UserQuizResolver } from './user-quiz.resolver';

export const UserQuizModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(UserQuizService)
    .toSelf()
    .inSingletonScope();
  bind(UserQuizResolver)
    .toSelf()
    .inSingletonScope();
  bind(UserQuizMutationResolver)
    .toSelf()
    .inSingletonScope();
  bind(UserQuizEdgeResolver)
    .toSelf()
    .inSingletonScope();
  bind(UserQuizAggreateResolver)
    .toSelf()
    .inSingletonScope(); 
  bind(LOADER_TYPES.UserQuizLoader).toDynamicValue(() =>
    createUserQuizLoader(),
  );
});
