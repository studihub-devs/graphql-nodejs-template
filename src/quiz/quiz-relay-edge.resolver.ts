import { GraphQLResolveInfo } from 'graphql';
import { injectable } from 'inversify';
import _ from 'lodash';
import { LOADER_TYPES } from '../core/dataloader/loader-types';
import { Loader } from '../core/decorators/loader.decorator';
import { FieldResolver, Info, Resolver, Root } from 'type-graphql';
import { decodeCursor } from '../utils/cursor-buffer';
import { QuizEdge } from './types/quiz-edge';
import { QuizService } from './services/quiz.service';
import { Quiz } from './entities/quiz.entity';
import { QuizLoader } from './services/quiz-by-id.loader';

@injectable()
@Resolver(() => QuizEdge)
export class QuizEdgeResolver {
  constructor(private quizService: QuizService) {}

  @FieldResolver(() => Quiz)
  async node(
    @Root() edge: QuizEdge,
    @Info() info: GraphQLResolveInfo,
    @Loader(LOADER_TYPES.QuizLoader) loader: QuizLoader,
  ): Promise<Quiz> {
    const currObject = JSON.parse(decodeCursor(edge.cursor));
    return loader.load({
      id: parseInt(currObject['id']),
      fields: this.quizService.getFieldList(info),
    });
  }
}
