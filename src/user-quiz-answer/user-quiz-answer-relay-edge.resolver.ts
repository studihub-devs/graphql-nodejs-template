import { GraphQLResolveInfo } from 'graphql';
import { injectable } from 'inversify';
import _ from 'lodash';
import { LOADER_TYPES } from '../core/dataloader/loader-types';
import { Loader } from '../core/decorators/loader.decorator';
import { FieldResolver, Info, Resolver, Root } from 'type-graphql';
import { decodeCursor } from '../utils/cursor-buffer';
import { UserQuizAnswerEdge } from './types/user-quiz-answer-edge';
import { UserQuizAnswer } from './entities/user-quiz-answer.entity';
import { UserQuizAnswerService } from './services/user-quiz-answer.service';
import { UserQuizAnswerLoader } from './services/user-quiz-answer-by-id.loader';

@injectable()
@Resolver(() => UserQuizAnswerEdge)
export class UserQuizAnswerEdgeResolver {
  constructor(private userQuizAnswerService: UserQuizAnswerService) {}

  @FieldResolver(() => UserQuizAnswer)
  async node(
    @Root() edge: UserQuizAnswerEdge,
    @Info() info: GraphQLResolveInfo,
    @Loader(LOADER_TYPES.UserQuizAnswerLoader) loader: UserQuizAnswerLoader,
  ): Promise<UserQuizAnswer> {
    const currObject = JSON.parse(decodeCursor(edge.cursor));
    return loader.load({
      id: parseInt(currObject['id']),
      fields: this.userQuizAnswerService.getFieldList(info),
    });
  }
}
