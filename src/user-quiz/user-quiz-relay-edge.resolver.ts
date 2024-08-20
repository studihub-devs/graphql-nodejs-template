import { GraphQLResolveInfo } from 'graphql';
import { injectable } from 'inversify';
import _ from 'lodash';
import { LOADER_TYPES } from '../core/dataloader/loader-types';
import { Loader } from '../core/decorators/loader.decorator';
import { FieldResolver, Info, Resolver, Root } from 'type-graphql';
import { decodeCursor } from '../utils/cursor-buffer';
import { UserQuizEdge } from './types/user-quiz-edge';
import { UserQuizService } from './services/user-quiz.service';
import { UserQuiz } from './entities/user-quiz.entity';
import { UserQuizLoader } from './services/user-quiz-by-id.loader';

@injectable()
@Resolver(() => UserQuizEdge)
export class UserQuizEdgeResolver {
  constructor(private userQuizService: UserQuizService) {}

  @FieldResolver(() => UserQuiz)
  async node(
    @Root() edge: UserQuizEdge,
    @Info() info: GraphQLResolveInfo,
    @Loader(LOADER_TYPES.UserQuizLoader) loader: UserQuizLoader,
  ): Promise<UserQuiz> {
    const currObject = JSON.parse(decodeCursor(edge.cursor));
    return loader.load({
      id: parseInt(currObject['id']),
      fields: this.userQuizService.getFieldList(info),
    });
  }
}
