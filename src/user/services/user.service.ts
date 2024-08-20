import { GraphQLResolveInfo } from 'graphql';
import { injectable } from 'inversify';

import { User } from '../entities/user.entity';
import { BaseService } from '../../core/services/base.service';
import { CacheService } from '../../shared/services/cache.service';
import { Context } from '../../core/types/context';
import { plainToClass } from 'class-transformer';
import knex, { writer } from '../../knex';
import { hash } from 'bcryptjs';
import { UserWhereInput } from '../types/user-where.input';

@injectable()
export class UserService extends BaseService<User> {
  constructor(readonly cacheService: CacheService) {
    super(cacheService);
    this.type = User;
    this.transformFields = {};
  }

  async getOne(
    where: UserWhereInput,
    info?: GraphQLResolveInfo,
  ): Promise<User> {
    return knex
      .from('studihub.user')
      .select('*')
      .where({ id: where.id })
      .first()
      .then(row => plainToClass(User, row));
  }

  // async getMany(
  //   args: UsersArgs,
  //   context: AdminContext | Context,
  //   info?: GraphQLResolveInfo,
  // ): Promise<User[]> {
  //   const isAdmin = isAdminContext(context);
  //   return this.userDao.getMany(
  //     args,
  //     isAdmin,
  //     this.getFieldList(info),
  //     (context as Context).user,
  //   );
  // }

  // async getCount(
  //   args: UsersArgs,
  //   context: AdminContext | Context,
  // ): Promise<number> {
  //   return this.userDao.getCount(
  //     args,
  //     isAdminContext(context),
  //     (context as Context).user,
  //   );
  // }

  // async update(
  //   where: UserWhereUniqueInput,
  //   data: UserUpdateInput,
  //   info: GraphQLResolveInfo,
  // ): Promise<User> {
  //   await this.cacheService.redis.del(`${User.name}.${where.id}`);
  //   return this.userDao.update(where, data, this.getFieldList(info));
  // }

  // async delete(
  //   where: UserWhereUniqueInput,
  //   data: UserDeleteInput,
  //   info: GraphQLResolveInfo,
  // ): Promise<User> {
  //   await this.cacheService.redis.del(`${User.name}.${where.id}`);
  //   return this.userDao.delete(where, data, this.getFieldList(info));
  // }

  // async create(
  //   data: UserCreateInput,
  //   info: GraphQLResolveInfo,
  //   ctx: Context,
  // ): Promise<User> {
  //   return writer.transaction(async trx => {
  //     const result = await trx
  //       .from('studihub.user')
  //       .insert({
  //         email: data.email,
  //         password: data.password && (await hash(data.password, 10)),
  //         name: data.name,
  //         gender: data.gender,
  //         birth_day: data.birthDay,
  //         phone_number: data.phoneNumber,
  //         avatar_url: data.avatarUrl,
  //         created_at: new Date(),
  //         is_active: true,
  //         role_id: data.roleId,
  //         social_media: data.socialMedia,
  //         created_by: ctx.user?.id,
  //       })
  //       .returning(this.getFieldList(info))
  //       .then(rows => plainToClass(User, rows[0]));
  //     return result;
  //   });
  // }
}
