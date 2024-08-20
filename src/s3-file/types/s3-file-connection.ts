import Connection from '../../shared/types/connection';
import { ObjectType } from 'type-graphql';
import { S3FileAggregate } from './s3-file-aggregate';
import { S3FileArgs } from './s3-file.args';

@ObjectType()
export class S3FileConnection extends Connection(S3FileAggregate) {
  constructor(args: S3FileArgs) {
    super();
    this.aggregate = new S3FileAggregate(args);
  }
}
