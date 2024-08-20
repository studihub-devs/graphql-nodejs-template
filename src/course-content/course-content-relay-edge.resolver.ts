import { GraphQLResolveInfo } from 'graphql';
import { injectable } from 'inversify';
import _ from 'lodash';
import { LOADER_TYPES } from '../core/dataloader/loader-types';
import { Loader } from '../core/decorators/loader.decorator';
import { FieldResolver, Info, Resolver, Root } from 'type-graphql';

import { decodeCursor } from '../utils/cursor-buffer';
import { CourseContentEdge } from './types/course-content-edge';
import { CourseContent } from './entities/course-content.entity';
import { CourseContentService } from './services/course-content.service';
import { CourseContentLoader } from './services/course-content-by-id.loader';

@injectable()
@Resolver(() => CourseContentEdge)
export class CourseContentEdgeResolver {
  constructor(private courseContentService: CourseContentService) {}

  @FieldResolver(() => CourseContent)
  async node(
    @Root() edge: CourseContentEdge,
    @Info() info: GraphQLResolveInfo,
    @Loader(LOADER_TYPES.CourseContentLoader) loader: CourseContentLoader,
  ): Promise<CourseContent> {
    const currObject = JSON.parse(decodeCursor(edge.cursor));
    return loader.load({
      id: parseInt(currObject['id']),
      fields: this.courseContentService.getFieldList(info),
    });
  }
}
