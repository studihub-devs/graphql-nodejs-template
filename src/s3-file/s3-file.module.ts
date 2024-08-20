import { ContainerModule, interfaces } from 'inversify';
import { LOADER_TYPES } from '../core/dataloader/loader-types';
import { S3FileEdgeResolver } from './s3-file-relay.resolver';
import { S3FileAggregateResolver } from './s3-file.aggregate.resolver';
import { S3FileResolver } from './s3-file.resolver';
import { createS3FileLoader } from './services/s3-file-by-id.loader';
import { S3FileService } from './services/s3-file.service';

export const S3FileModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(S3FileService)
    .toSelf()
    .inSingletonScope();
  bind(S3FileResolver)
    .toSelf()
    .inSingletonScope();
  bind(S3FileAggregateResolver)
    .toSelf()
    .inSingletonScope();
  bind(S3FileEdgeResolver)
    .toSelf()
    .inSingletonScope();
  bind(LOADER_TYPES.S3FileLoader).toDynamicValue(() => createS3FileLoader()); 
});


