import Connection from '../../shared/types/connection';
import { ObjectType } from 'type-graphql';
import { NewsConnectionAggregate } from './news.aggregate-connection';
import { NewsArgs } from './news.args';

@ObjectType()
export class NewsConnection extends Connection(NewsConnectionAggregate) {
  constructor(args: NewsArgs) {
    super();
    this.aggregate = new NewsConnectionAggregate(args);
  }
}
