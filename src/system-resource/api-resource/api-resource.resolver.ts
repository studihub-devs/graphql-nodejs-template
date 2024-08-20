import { GraphQLResolveInfo } from 'graphql';
import { injectable } from 'inversify';
import {
  Arg,
  Args,
  Authorized,
  Info,
  Mutation,
  Query,
  Resolver,
  Ctx,
  FieldResolver,
  Root,
} from 'type-graphql';

import { APIResource } from './entities/api-resource.entity';
import { ResourceService } from '../resource/services/resource.service';
import { APIResouceService } from './services/api-resource.service';
import { Context } from '../../core/types/context';
import { APIResourceCreateInput } from './types/api-resource-create.input';
import { APIResourceOrError } from './types/api-resource-or-error';
import { APIResourceWhereInput } from './types/api-resource-where.input';
import { APIResourceUpdateInput } from './types/api-resource-update.input';
import { APIResourceArgs } from './types/api-resource.args';
import { APIResourceConnection } from './types/api-resource-connection';
import { Resource } from '../resource/entities/resource.entity';
import { User } from '../../user/entities/user.entity';
import { Loader } from '../../core/decorators/loader.decorator';
import { LOADER_TYPES } from '../../core/dataloader/loader-types';
import { UserLoader } from '../../user/services/user-by-id.loader';
import { UserService } from '../../user/services/user.service';
import { ResourceLoader } from '../resource/services/resource-by-id.loader';

@injectable()
@Resolver(() => APIResource)
export class APIResourceResolver {
  constructor(
    private apiService: APIResouceService,
    private resourceService: ResourceService,
    private userService: UserService,
  ) {}

  @FieldResolver(() => User, { nullable: true })
  async createdBy(
    @Root() ar: APIResource,
    @Info() info: GraphQLResolveInfo,
    @Loader(LOADER_TYPES.UserLoader) userLoader: UserLoader,
  ): Promise<User> {
    if (!ar.createdBy) {
      return null;
    }
    return userLoader.load({
      id: ar.createdBy,
      fields: this.userService.getFieldList(info),
    });
  }

  @FieldResolver(() => Resource)
  async resource(
    @Root() ar: APIResource,
    @Info() info: GraphQLResolveInfo,
    @Loader(LOADER_TYPES.ResourceLoader) resourceLoader: ResourceLoader,
  ): Promise<Resource> {
    return resourceLoader.load({
      id: ar.resourceId,
      fields: this.resourceService.getFieldList(info),
    });
  }

  @Authorized()
  @Mutation(() => APIResourceOrError)
  async createAPIResource(
    @Arg('data') data: APIResourceCreateInput,
    @Ctx() ctx: Context,
    @Info() info: GraphQLResolveInfo,
  ): Promise<typeof APIResourceOrError> {
    return this.apiService.create(data, ctx, info);
  }

  @Authorized()
  @Mutation(() => APIResourceOrError)
  async updateAPIResource(
    @Arg('where') where: APIResourceWhereInput,
    @Arg('data') data: APIResourceUpdateInput,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<typeof APIResourceOrError> {
    return this.apiService.update(where, data, info, ctx);
  }

  @Authorized()
  @Mutation(() => APIResource)
  async deleteAPIResource(
    @Arg('where') where: APIResourceWhereInput,
    @Info() info: GraphQLResolveInfo,
  ): Promise<APIResource> {
    return this.apiService.delete(where, info);
  }

  @Query(() => APIResource, { nullable: true })
  async api(
    @Arg('where') where: APIResourceWhereInput,
    @Info() info: GraphQLResolveInfo,
  ): Promise<APIResource> {
    return this.apiService.getOne(where, info);
  }

  @Query(() => [APIResource])
  async apis(
    @Args() args: APIResourceArgs,
    @Info() info: GraphQLResolveInfo,
  ): Promise<APIResource[]> {
    return this.apiService.getMany(args, info);
  }

  @Query(() => APIResourceConnection)
  APIResourceConnection(@Args() args: APIResourceArgs): APIResourceConnection {
    return new APIResourceConnection(args);
  }
}
