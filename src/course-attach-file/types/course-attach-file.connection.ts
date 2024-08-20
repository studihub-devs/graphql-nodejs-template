import Connection from '../../shared/types/connection';
import { ObjectType } from 'type-graphql';
import { CourseAttachFileConnectionAggregate } from './course-attach-file.aggregate-connection';
import { CourseAttachFileArgs } from './course-attach-file.args';

@ObjectType()
export class CourseAttachFileConnection extends Connection(
  CourseAttachFileConnectionAggregate,
) {
  constructor(args: CourseAttachFileArgs) {
    super();
    this.aggregate = new CourseAttachFileConnectionAggregate(args);
  }
}
