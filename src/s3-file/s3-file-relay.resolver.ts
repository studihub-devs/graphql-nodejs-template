import { GraphQLResolveInfo } from 'graphql';
import { injectable } from 'inversify';
import _ from 'lodash';
import { LOADER_TYPES } from '../core/dataloader/loader-types';
import { Loader } from '../core/decorators/loader.decorator';
import { FieldResolver, Info, Resolver, Root } from 'type-graphql';
import { decodeCursor } from '../utils/cursor-buffer';
import { S3FileService } from './services/s3-file.service';
import { S3FileLoader } from './services/s3-file-by-id.loader';
import { S3File } from './entities/s3-file.entity';
import { S3FileEdge } from './types/s3-file-edge';

@injectable()
@Resolver(() => S3FileEdge)
export class  S3FileEdgeResolver {
  constructor(private  s3FileService:  S3FileService) {}

  @FieldResolver(() =>  S3File)
  async node(
    @Root() edge:  S3FileEdge,
    @Info() info: GraphQLResolveInfo,
    @Loader(LOADER_TYPES.S3FileLoader) loader:  S3FileLoader,
  ): Promise<S3File> {
    const currObject = JSON.parse(decodeCursor(edge.cursor));
    return loader.load({
      id: parseInt(currObject['id']),
      fields: this.s3FileService.getFieldList(info),
    });
  }
}
