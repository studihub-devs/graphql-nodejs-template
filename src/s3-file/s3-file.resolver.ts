import { GraphQLResolveInfo } from 'graphql';
import { injectable } from 'inversify';
import { Context } from '../core/types/context';
import {
  Arg,  
  Args,  
  Ctx,  
  FieldResolver, 
  Info, 
  Query, 
  Resolver,
  Root,
} from 'type-graphql';
import { S3File } from './entities/s3-file.entity';
import { S3FileService } from './services/s3-file.service';
import { FixedSize } from './types/fixed-size';
import { S3FileConnection } from './types/s3-file-connection';
import { S3FileRelayConnection } from './types/s3-file-relay.connection';
import { S3FileArgs } from './types/s3-file.args';

@injectable()
@Resolver(() => S3File)
export class S3FileResolver {
  constructor(private s3FileService: S3FileService) {}

  @FieldResolver(() => S3File, { nullable: true })
  fixed(
    @Root() file: S3File,
    @Arg('width', () => FixedSize) width: FixedSize,
  ): S3File {
    return this.s3FileService.getFixedImage(file, width);
  }

  @Query(() => [S3File])
  async S3Files(
    @Args() args: S3FileArgs,
    @Info() info: GraphQLResolveInfo,
  ): Promise<S3File[]> {
    return this.s3FileService.getMany(args, info);
  }

  @Query(() => S3FileConnection)
  s3FileConnection(@Args() args: S3FileArgs): S3FileConnection {
    return new S3FileConnection(args);
  }

  @Query(() => S3FileRelayConnection)
  async S3FilesRelay(
    @Args() args: S3FileArgs,
    @Ctx() ctx: Context,
  ): Promise<S3FileRelayConnection> {
    return this.s3FileService.getManyRelay(args, ctx);
  }
}
