import { ObjectType } from 'type-graphql';
import { CourseContentArgs } from './course-content.args';

@ObjectType()
export class CourseContentConnectionAggregate {
  constructor(public readonly args: CourseContentArgs) {}
}
