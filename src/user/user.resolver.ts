import { GraphQLResolveInfo } from 'graphql';
import { injectable } from 'inversify';
import {
  Resolver,
  Info,
  Mutation,
  Authorized,
  Arg,
  Query,
  Ctx,
} from 'type-graphql';

import { UserService } from './services/user.service';
import { User } from './entities/user.entity';
import { Context } from '../core/types/context';
import { CanMutateUser } from './shared/can-update-user.guard';
import { UserWhereInput } from './types/user-where.input';

@injectable()
@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  // @Authorized()
  // @CanMutateUser()
  // @Mutation(() => User)
  // async updateUser(
  //   @Arg('where') where: UserWhereUniqueInput,
  //   @Arg('data') data: UserUpdateInput,
  //   @Info() info: GraphQLResolveInfo,
  // ): Promise<User> {
  //   return this.userService.update(where, data, info);
  // }

  // @Authorized()
  // @CanMutateUser()
  // @Mutation(() => User)
  // async createUser(
  //   @Arg('data') data: UserCreateInput,
  //   @Info() info: GraphQLResolveInfo,
  //   @Ctx() ctx: Context,
  // ): Promise<User> {
  //   return this.userService.create(data, info, ctx);
  // }

  // @Authorized()
  // @CanMutateUser()
  // @Mutation(() => User)
  // async deleteUser(
  //   @Arg('where') where: UserWhereUniqueInput,
  //   @Arg('data') data: UserDeleteInput,
  //   @Info() info: GraphQLResolveInfo,
  // ): Promise<User> {
  //   return this.userService.delete(where, data, info);
  // }

  // @Query(() => [User])
  // async users(
  //   @Args() args: UsersArgs,
  //   @Info() info: GraphQLResolveInfo,
  //   @Ctx() context: Context,
  // ): Promise<User[]> {
  //   return this.userService.getMany(args, context, info);
  // }

  @Query(() => User)
  async user(
    @Arg('where') where: UserWhereInput,
    @Info() info: GraphQLResolveInfo,
  ): Promise<User> {
    return this.userService.getOne(where, info);
  }

  // @Query(() => UsersConnection)
  // usersConnection(@Args() args: UsersArgs): UsersConnection {
  //   return new UsersConnection(args);
  // }
}
