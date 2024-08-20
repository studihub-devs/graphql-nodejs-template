import { ObjectType } from 'type-graphql';
import { CourseCategoryArgs } from './course-category.args';

@ObjectType()
export class CourseCategoryConnectionAggregate {
  constructor(public readonly args: CourseCategoryArgs) {}
}
