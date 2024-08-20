import { GraphQLResolveInfo } from 'graphql';
import { Context } from '../../core/types/context';
import { ObjectType } from 'type-graphql';

import RelayConnection from '../../core/types/relay-connection';
import { S3FileEdge } from './s3-file-edge';


@ObjectType()
export class S3FileRelayConnection extends RelayConnection(S3FileEdge) {
  constructor(info: GraphQLResolveInfo) {
    super();
    this.edges = new S3FileEdge(info);
  }
}
