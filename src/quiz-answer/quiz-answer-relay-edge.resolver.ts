import { GraphQLResolveInfo } from 'graphql';
import { injectable } from 'inversify';
import _ from 'lodash';
import { LOADER_TYPES } from '../core/dataloader/loader-types';
import { Loader } from '../core/decorators/loader.decorator';
import { FieldResolver, Info, Resolver, Root } from 'type-graphql';
import { decodeCursor } from '../utils/cursor-buffer';
import { QuizAnswerEdge } from './types/quiz-answer-edge';
import { QuizAnswerService } from './services/quiz-answer.service';
import { QuizAnswer } from './entities/quiz-answer.entity';
import { QuizAnswerLoader } from './services/quiz-answer-by-id.loader';

@injectable()
@Resolver(() => QuizAnswerEdge)
export class QuizAnswerEdgeResolver {
  constructor(private quizAnswerService: QuizAnswerService) {}

  @FieldResolver(() => QuizAnswer)
  async node(
    @Root() edge: QuizAnswerEdge,
    @Info() info: GraphQLResolveInfo,
    @Loader(LOADER_TYPES.QuizAnswerLoader) loader: QuizAnswerLoader,
  ): Promise<QuizAnswer> {
    const currObject = JSON.parse(decodeCursor(edge.cursor));
    return loader.load({
      id: parseInt(currObject['id']),
      fields: this.quizAnswerService.getFieldList(info),
    });
  }
}
