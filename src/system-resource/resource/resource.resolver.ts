import { GraphQLResolveInfo } from 'graphql';
import { injectable } from 'inversify';
import {
  Arg,
  Authorized,
  Info,
  Mutation,
  Resolver,
  Query,
  Args,
  Ctx,
  FieldResolver,
  Root,
} from 'type-graphql';

import { Resource } from './entities/resource.entity';
import { ResourceService } from './services/resource.service';
import { ResourceCreateInput } from './types/resource-create.input';
import { ResourceWhereInput } from './types/resource-where.input';
import { ResourcesArgs } from './types/resources.args';
import { ResourceConnection } from './types/resource-connection';
import { ResourceOrError } from './types/resource-or-error';
import { Context } from '../../core/types/context';
import { User } from '../../user/entities/user.entity';
import { Loader } from '../../core/decorators/loader.decorator';
import { LOADER_TYPES } from '../../core/dataloader/loader-types';
import { UserLoader } from '../../user/services/user-by-id.loader';
import { UserService } from '../../user/services/user.service';

@injectable()
@Resolver(() => Resource)
export class ResourceResolver {
  constructor(
    private resourceService: ResourceService,
    private userService: UserService,
  ) {}

  @FieldResolver(() => User, { nullable: true })
  async createdBy(
    @Root() resource: Resource,
    @Info() info: GraphQLResolveInfo,
    @Loader(LOADER_TYPES.UserLoader) userLoader: UserLoader,
  ): Promise<User> {
    if (!resource.createdBy) {
      return null;
    }
    return userLoader.load({
      id: resource.createdBy,
      fields: this.userService.getFieldList(info),
    });
  }

  @Authorized()
  @Mutation(() => ResourceOrError)
  async createResource(
    @Arg('data') data: ResourceCreateInput,
    @Ctx() ctx: Context,
    @Info() info: GraphQLResolveInfo,
  ): Promise<typeof ResourceOrError> {
    return this.resourceService.create(data, ctx, info);
  }

  @Authorized()
  @Mutation(() => ResourceOrError)
  async updateResource(
    @Arg('where') where: ResourceWhereInput,
    @Arg('data') data: ResourceCreateInput,
    @Info() info: GraphQLResolveInfo,
  ): Promise<typeof ResourceOrError> {
    return this.resourceService.update(where, data, info);
  }

  @Authorized()
  @Mutation(() => Resource)
  async deleteResource(
    @Arg('where') where: ResourceWhereInput,
    @Info() info: GraphQLResolveInfo,
  ): Promise<Resource> {
    return this.resourceService.delete(where, info);
  }

  @Query(() => Resource, { nullable: true })
  async resource(
    @Arg('where') where: ResourceWhereInput,
    @Info() info: GraphQLResolveInfo,
  ): Promise<Resource> {
    return this.resourceService.getOne(where, info);
  }

  @Query(() => [Resource])
  async resources(
    @Args() args: ResourcesArgs,
    @Info() info: GraphQLResolveInfo,
  ): Promise<Resource[]> {
    return this.resourceService.getMany(args, info);
  }

  @Query(() => ResourceConnection)
  resourceConnection(@Args() args: ResourcesArgs): ResourceConnection {
    return new ResourceConnection(args);
  }
}
