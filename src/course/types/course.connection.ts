import Connection from '../../shared/types/connection';
import { ObjectType } from 'type-graphql';
import { CourseConnectionAggregate } from './course.aggregate-connection';
import { CourseArgs } from './course.args';

@ObjectType()
export class CourseConnection extends Connection(CourseConnectionAggregate) {
  constructor(args: CourseArgs) {
    super();
    this.aggregate = new CourseConnectionAggregate(args);
  }
}
