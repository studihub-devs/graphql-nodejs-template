import { injectable } from 'inversify';
import { GraphQLResolveInfo } from 'graphql';
import { RoleCreateInput } from '../types/role-create.input';
import { plainToClass } from 'class-transformer';
import { RolesWhereUniqueInput } from '../types/role-where-unique.input';
import { RolesUpdateInput } from '../types/role-update.input';
import { RolesArgs } from '../types/role.args';
import { defaultMetadataStorage as classTransformerDefaultMetadataStorage } from 'class-transformer/cjs/storage';
import { Knex } from 'knex';
import _ from 'lodash';
import { Role } from '../entities/role.entity';
import { RoleOrError } from '../types/role-or-error';
import { BaseService } from '../../../core/services/base.service';
import { CacheService } from '../../../shared/services/cache.service';
import { Context } from '../../../core/types/context';
import knex, { writer } from '../../../knex';
import { PostgreErrorCode } from '../../../core/exceptions/postgre-error-code';
import { ErrorFactory } from '../../../core/services/error-factory';

@injectable()
export class RoleService extends BaseService<Role> {
  constructor(readonly cacheService: CacheService) {
    super(cacheService);
    this.type = Role;
    this.transformFields = {
      createdBy: 'created_by',
    };
  }
  async create(
    data: RoleCreateInput,
    info: GraphQLResolveInfo,
    ctx: Context,
  ): Promise<typeof RoleOrError> {
    return writer
      .transaction(async trx => {
        const role = await trx
          .from('studihub.role')
          .insert({
            name: data.name,
            created_by: ctx?.user?.id,
          })
          .returning(['id', ...this.getFieldList(info)])
          .then(rows => plainToClass(Role, rows[0]));

        if (role) {
          await trx
            .from('studihub.role_resource')
            .insert(
              data.resources.map(rs => ({
                role_id: role.id,
                resource_id: rs.id,
                created_by: ctx?.user?.id,
                status: rs.status,
              })),
            )
            .transacting(trx)
            .onConflict(['role_id', 'resource_id'])
            .merge();
        }
        return role;
      })
      .catch(e => {
        if (e.code === PostgreErrorCode.UNIQUE_VIOLATION) {
          throw ErrorFactory.createForbiddenError('Role name already exist');
        }
        throw ErrorFactory.createInternalServerError();
      });
  }

  async update(
    where: RolesWhereUniqueInput,
    data: RolesUpdateInput,
    info: GraphQLResolveInfo,
    ctx: Context,
  ): Promise<typeof RoleOrError> {
    return writer
      .transaction(async trx => {
        let role = plainToClass(Role, {
          id: where.id,
        });
        if (data.name) {
          role = await trx
            .from('studihub.role')
            .where({ id: where.id })
            .update({
              name: data.name,
              created_by: ctx?.user?.id,
              updated_at: new Date(),
            })
            .returning(this.getFieldList(info))
            .then(rows => plainToClass(Role, rows[0]));
        }

        if (data.resources.length > 0) {
          await trx
            .from('csssystem.role_resource')
            .insert(
              data.resources.map(rs => ({
                role_id: where.id,
                resource_id: rs.id,
                status: rs.status,
                created_by: ctx?.user?.id,
                updated_at: new Date(),
              })),
            )
            .transacting(trx)
            .onConflict(['role_id', 'resource_id'])
            .merge();
        }
        return role;
      })
      .catch(e => {
        if (e.code === PostgreErrorCode.UNIQUE_VIOLATION) {
          throw ErrorFactory.createForbiddenError('Role name already exist');
        }
        throw ErrorFactory.createInternalServerError();
      });
  }

  async delete(
    where: RolesWhereUniqueInput,
    info: GraphQLResolveInfo,
  ): Promise<Role> {
    return writer.transaction(async trx => {
      const role = await trx
        .from('studihub.role')
        .where({ id: where.id })
        .del()
        .returning(['id', ...this.getFieldList(info)])
        .then(rows => plainToClass(Role, rows[0]));

      await trx
        .from('studihub.role_resource')
        .where({ role_id: role.id })
        .del();

      await trx
        .from({ ur: 'studihub.user_resource' })
        .whereRaw(
          `
          exists
            ( select * from studihub.user u where u.role_id = ${role.id} and ur.user_id = u.id)`,
        )
        .del();

      await trx
        .from({ ura: 'studihub.user_resource_api' })
        .whereRaw(
          `
          exists 
            ( select * from studihub.user u where u.role_id = ${role.id} and ura.user_id = u.id)`,
        )
        .del();

      return role;
    });
  }

  async getOne(
    where: RolesWhereUniqueInput,
    info: GraphQLResolveInfo,
  ): Promise<Role> {
    return knex
      .from('studihub.role')
      .where({ id: where.id })
      .select(...this.getFieldList(info))
      .first()
      .then(row => plainToClass(Role, row));
  }

  async getMany(
    args: RolesArgs,
    info?: GraphQLResolveInfo,
    ctx?: Context,
  ): Promise<Role[]> {
    return await this.createQueryBuilder(args, info, ctx).then(rows =>
      rows.map(row => plainToClass(Role, row)),
    );
  }

  async getCount(args: RolesArgs): Promise<number> {
    return this.createQueryBuilder(args)
      .count()
      .clearOrder()
      .clear('offset')
      .first()
      .then(row => +row.count);
  }

  createQueryBuilder(
    args: RolesArgs,
    info?: GraphQLResolveInfo,
    ctx?: Context,
  ): Knex.QueryBuilder {
    const qb = knex.from({ r: 'studihub.role' });

    if (info) {
      qb.select(this.getFieldList(info));
    }

    if (args.where?.id) {
      qb.andWhere('r.id', args.where?.id);
    }

    if (args.where?.name?.contains) {
      qb.andWhere('r.name', 'ilike', `%${args.where.name.contains}%`);
    }

    if (
      ctx?.user &&
      ctx?.user.roleId.toString() != process.env.SUPER_ADMIN_ROLE
    ) {
      qb.andWhere({
        'r.id': ctx?.user.roleId,
      });
    }

    if (args.orderBy) {
      _.forIn(args.orderBy, (value, key) => {
        qb.orderBy(
          classTransformerDefaultMetadataStorage.findExposeMetadata(Role, key)
            ?.options?.name || key,
          value,
        );
      });
    }

    if (args.skip) {
      qb.offset(args.skip);
    }

    if (args.first) {
      qb.limit(args.first);
    }

    return qb;
  }
}
