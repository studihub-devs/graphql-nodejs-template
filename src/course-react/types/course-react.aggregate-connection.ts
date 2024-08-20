import { ObjectType } from 'type-graphql';
import { CourseReactArgs } from './course-react.args';

@ObjectType()
export class CourseReactConnectionAggregate {
  constructor(public readonly args: CourseReactArgs) {}
}
