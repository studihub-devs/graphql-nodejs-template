import { injectable } from 'inversify';
import {
  Arg,
  Args,
  Authorized,
  Ctx,
  FieldResolver,
  Info,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { GraphQLResolveInfo } from 'graphql';
import { RoleCreateInput } from './types/role-create.input';
import { RoleService } from './services/role.service';
import { RolesWhereUniqueInput } from './types/role-where-unique.input';
import { RolesUpdateInput } from './types/role-update.input';
import { RolesArgs } from './types/role.args';
import { RolesConnection } from './types/roles-connections';
import _ from 'lodash';
import { Role } from './entities/role.entity';
import { RoleOrError } from './types/role-or-error';
import { Context } from '../../core/types/context';
import { User } from '../../user/entities/user.entity';
import { Loader } from '../../core/decorators/loader.decorator';
import { LOADER_TYPES } from '../../core/dataloader/loader-types';
import { UserLoader } from '../../user/services/user-by-id.loader';
import { UserService } from '../../user/services/user.service';

@injectable()
@Resolver(() => Role)
export class RoleResolver {
  constructor(
    private roleService: RoleService,
    private userService: UserService,
  ) {}

  @FieldResolver(() => User, { nullable: true })
  async createdBy(
    @Root() role: Role,
    @Info() info: GraphQLResolveInfo,
    @Loader(LOADER_TYPES.UserLoader) userLoader: UserLoader,
  ): Promise<User> {
    if (!role.createdBy) {
      return null;
    }
    return userLoader.load({
      id: role.createdBy,
      fields: this.userService.getFieldList(info),
    });
  }

  @Authorized()
  @Mutation(() => RoleOrError)
  async createRole(
    @Arg('data') data: RoleCreateInput,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<typeof RoleOrError> {
    return this.roleService.create(data, info, ctx);
  }

  @Authorized()
  @Mutation(() => RoleOrError)
  async updateRole(
    @Arg('where') where: RolesWhereUniqueInput,
    @Arg('data') data: RolesUpdateInput,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<typeof RoleOrError> {
    return this.roleService.update(where, data, info, ctx);
  }

  @Authorized()
  @Mutation(() => Role)
  async deleteRole(
    @Arg('where') where: RolesWhereUniqueInput,
    @Info() info: GraphQLResolveInfo,
  ): Promise<Role> {
    return this.roleService.delete(where, info);
  }

  @Authorized()
  @Query(() => RolesConnection)
  rolesConnection(@Args() args: RolesArgs): RolesConnection {
    return new RolesConnection(args);
  }

  @Authorized()
  @Query(() => [Role])
  async roles(
    @Args() args: RolesArgs,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<Role[]> {
    return this.roleService.getMany(args, info, ctx);
  }
}
