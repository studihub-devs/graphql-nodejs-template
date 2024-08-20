import { ObjectType } from 'type-graphql';
import Connection from '../../shared/types/connection';
import { CourseReviewConnectionAggregate } from './course-review.aggregate-connection';
import { CourseReviewArgs } from './course-review.args';

@ObjectType()
export class CourseReviewConnection extends Connection(
  CourseReviewConnectionAggregate,
) {
  constructor(args: CourseReviewArgs) {
    super();
    this.aggregate = new CourseReviewConnectionAggregate(args);
  }
}
