import Connection from '../../shared/types/connection';
import { ObjectType } from 'type-graphql';
import { CourseContentConnectionAggregate } from './course-content.aggregate-connection';
import { CourseContentArgs } from './course-content.args';

@ObjectType()
export class CourseContentConnection extends Connection(
  CourseContentConnectionAggregate,
) {
  constructor(args: CourseContentArgs) {
    super();
    this.aggregate = new CourseContentConnectionAggregate(args);
  }
}
