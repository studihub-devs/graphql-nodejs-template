import { ObjectType } from 'type-graphql';
import { CourseReviewArgs } from './course-review.args';

@ObjectType()
export class CourseReviewConnectionAggregate {
  constructor(public readonly args: CourseReviewArgs) {}
}
