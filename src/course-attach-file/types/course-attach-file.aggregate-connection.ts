import { ObjectType } from 'type-graphql';
import { CourseAttachFileArgs } from './course-attach-file.args';

@ObjectType()
export class CourseAttachFileConnectionAggregate {
  constructor(public readonly args: CourseAttachFileArgs) {}
}
