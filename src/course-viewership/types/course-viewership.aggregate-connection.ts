import { ObjectType } from 'type-graphql';
import { CourseViewershipArgs } from './course-viewership.args';

@ObjectType()
export class CourseViewershipConnectionAggregate {
  constructor(public readonly args: CourseViewershipArgs) {}
}
