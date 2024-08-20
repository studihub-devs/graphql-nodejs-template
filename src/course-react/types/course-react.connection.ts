import { ObjectType } from 'type-graphql';
import Connection from '../../shared/types/connection';
import { CourseReactConnectionAggregate } from './course-react.aggregate-connection';
import { CourseReactArgs } from './course-react.args';

@ObjectType()
export class CourseReactConnection extends Connection(
  CourseReactConnectionAggregate,
) {
  constructor(args: CourseReactArgs) {
    super();
    this.aggregate = new CourseReactConnectionAggregate(args);
  }
}
