import { ArgsType, Field } from 'type-graphql';
import { PaginationArgs } from '../../shared/types/pagination.args';
import { S3FileOrderByInput } from './s3-file-order-by.input';
import { S3FileWhereInput } from './s3-file-where.input';

@ArgsType()
export class S3FileArgs extends PaginationArgs {
  @Field({ nullable: true })
  where?: S3FileWhereInput;

  @Field({ nullable: true })
  orderBy?: S3FileOrderByInput;
}
