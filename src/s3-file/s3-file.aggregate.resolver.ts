import { Resolver, FieldResolver, Int, Root } from 'type-graphql';
import { injectable } from 'inversify';
import { S3FileAggregate } from './types/s3-file-aggregate';
import { S3FileService } from './services/s3-file.service';


@injectable()
@Resolver(() => S3FileAggregate)
export class S3FileAggregateResolver {
  constructor(private s3FileService: S3FileService) {}

  @FieldResolver(() => Int)
  async count(@Root() aggregate: S3FileAggregate): Promise<number> {
    return this.s3FileService.getCount(aggregate.args);
  }
}
