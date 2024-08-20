import { ObjectType } from 'type-graphql';
import Connection from '../../shared/types/connection';
import { CourseCategoryArgs } from './course-category.args';
import { CourseCategoryConnectionAggregate } from './course-category.aggregate-connection';

@ObjectType()
export class CourseCategoryConnection extends Connection(
  CourseCategoryConnectionAggregate,
) {
  constructor(args: CourseCategoryArgs) {
    super();
    this.aggregate = new CourseCategoryConnectionAggregate(args);
  }
}
