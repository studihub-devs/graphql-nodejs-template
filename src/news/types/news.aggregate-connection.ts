import { ObjectType } from 'type-graphql';
import { NewsArgs } from './news.args';

@ObjectType()
export class NewsConnectionAggregate {
  constructor(public readonly args: NewsArgs) {}
}
