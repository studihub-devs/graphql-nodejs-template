import { ObjectType } from 'type-graphql';
import { CourseArgs } from './course.args';

@ObjectType()
export class CourseConnectionAggregate {
  constructor(public readonly args: CourseArgs) {}
}
