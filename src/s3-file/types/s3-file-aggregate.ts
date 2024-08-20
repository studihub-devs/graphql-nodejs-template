import { ObjectType } from 'type-graphql';
import { S3FileArgs } from './s3-file.args';

@ObjectType()
export class S3FileAggregate {
  constructor(public readonly args: S3FileArgs) {}
}
