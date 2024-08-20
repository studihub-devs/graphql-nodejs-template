import { GraphQLResolveInfo } from 'graphql';
import { injectable } from 'inversify';
import {
  Args,
  Authorized,
  Ctx,
  FieldResolver,
  Info,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { RoleResource } from './entities/role-resource.entity';
import { RoleResourceService } from './services/role-resource.service';
import { RoleResourceArgs } from './types/role-resource-args';
import { Context } from '../../core/types/context';
import { User } from '../../user/entities/user.entity';
import { UserLoader } from '../../user/services/user-by-id.loader';
import { LOADER_TYPES } from '../../core/dataloader/loader-types';
import { Loader } from '../../core/decorators/loader.decorator';
import { UserService } from '../../user/services/user.service';
import { Resource } from '../resource/entities/resource.entity';
import { ResourceLoader } from '../resource/services/resource-by-id.loader';
import { ResourceService } from '../resource/services/resource.service';

@injectable()
@Resolver(() => RoleResource)
export class RoleResourceResolver {
  constructor(
    private roleResourceService: RoleResourceService,
    private userService: UserService,
    private resourceService: ResourceService,
  ) {}

  @FieldResolver(() => User, { nullable: true })
  async createdBy(
    @Root() rr: RoleResource,
    @Info() info: GraphQLResolveInfo,
    @Loader(LOADER_TYPES.UserLoader) userLoader: UserLoader,
  ): Promise<User> {
    if (!rr.createdBy) {
      return null;
    }
    return userLoader.load({
      id: rr.createdBy,
      fields: this.userService.getFieldList(info),
    });
  }

  @FieldResolver(() => Resource)
  async resource(
    @Root() rr: RoleResource,
    @Info() info: GraphQLResolveInfo,
    @Loader(LOADER_TYPES.ResourceLoader) resourceLoader: ResourceLoader,
  ): Promise<Resource> {
    return resourceLoader.load({
      id: rr.resourceId,
      fields: this.resourceService.getFieldList(info),
    });
  }

  @Authorized()
  @Query(() => [RoleResource], { nullable: true })
  async roleResources(
    @Args() args: RoleResourceArgs,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<RoleResource[]> {
    return this.roleResourceService.getResourceByRoleId(args, info, ctx);
  }
}
