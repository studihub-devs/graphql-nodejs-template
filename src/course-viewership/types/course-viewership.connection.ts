import { ObjectType } from 'type-graphql';
import Connection from '../../shared/types/connection';
import { CourseViewershipConnectionAggregate } from './course-viewership.aggregate-connection';
import { CourseViewershipArgs } from './course-viewership.args';

@ObjectType()
export class CourseViewershipConnection extends Connection(
  CourseViewershipConnectionAggregate,
) {
  constructor(args: CourseViewershipArgs) {
    super();
    this.aggregate = new CourseViewershipConnectionAggregate(args);
  }
}
