import { GraphQLResolveInfo } from 'graphql';
import { injectable } from 'inversify';
import _ from 'lodash';
import { LOADER_TYPES } from '../core/dataloader/loader-types';
import { Loader } from '../core/decorators/loader.decorator';
import { FieldResolver, Info, Resolver, Root } from 'type-graphql';
import { decodeCursor } from '../utils/cursor-buffer';
import { QuizQuestionEdge } from './types/quiz-question-edge';
import { QuizQuestionService } from './services/quiz-question.service';
import { QuizQuestion } from './entities/quiz-question.entity';
import { QuizQuestionLoader } from './services/quiz-question-by-id.loader';

@injectable()
@Resolver(() => QuizQuestionEdge)
export class QuizQuestionEdgeResolver {
  constructor(private quizQuestionService: QuizQuestionService) {}

  @FieldResolver(() => QuizQuestion)
  async node(
    @Root() edge: QuizQuestionEdge,
    @Info() info: GraphQLResolveInfo,
    @Loader(LOADER_TYPES.QuizQuestionLoader) loader: QuizQuestionLoader,
  ): Promise<QuizQuestion> {
    const currObject = JSON.parse(decodeCursor(edge.cursor));
    return loader.load({
      id: parseInt(currObject['id']),
      fields: this.quizQuestionService.getFieldList(info),
    });
  }
}
