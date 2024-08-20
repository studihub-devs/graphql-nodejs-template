import { GraphQLResolveInfo } from 'graphql';
import { injectable } from 'inversify';
import _ from 'lodash';
import { LOADER_TYPES } from '../core/dataloader/loader-types';
import { Loader } from '../core/decorators/loader.decorator';
import { FieldResolver, Info, Resolver, Root } from 'type-graphql';
import { Course } from './entities/course.entity';
import { CourseLoader } from './services/course-by-id.loader';
import { CourseService } from './services/course.service';
import { CourseEdge } from './types/course-edge';
import { decodeCursor } from '../utils/cursor-buffer';

@injectable()
@Resolver(() => CourseEdge)
export class CourseEdgeResolver {
  constructor(private courseService: CourseService) {}

  @FieldResolver(() => Course)
  async node(
    @Root() edge: CourseEdge,
    @Info() info: GraphQLResolveInfo,
    @Loader(LOADER_TYPES.CourseLoader) loader: CourseLoader,
  ): Promise<Course> {
    const currObject = JSON.parse(decodeCursor(edge.cursor));
    return loader.load({
      id: parseInt(currObject['id']),
      fields: this.courseService.getFieldList(info),
    });
  }
}
