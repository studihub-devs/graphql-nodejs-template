import { injectable } from 'inversify';
import { GraphQLResolveInfo } from 'graphql';
import _ from 'lodash';
import { Knex } from 'knex';
import { plainToClass } from 'class-transformer';
import { BaseService } from '../../../core/services/base.service';
import { CacheService } from '../../../shared/services/cache.service';
import knex, { writer } from '../../../knex';
import { defaultMetadataStorage as classTransformerDefaultMetadataStorage } from 'class-transformer/cjs/storage';
import { ResourceCreateInput } from '../types/resource-create.input';
import { Resource } from '../entities/resource.entity';
import { ResourceWhereInput } from '../types/resource-where.input';
import { ResourcesArgs } from '../types/resources.args';
import { ResourceOrError } from '../types/resource-or-error';
import { PostgreErrorCode } from '../../../core/exceptions/postgre-error-code';
import { Context } from '../../../core/types/context';
import { ErrorFactory } from '../../../core/services/error-factory';

@injectable()
export class ResourceService extends BaseService<Resource> {
  constructor(readonly cacheService: CacheService) {
    super(cacheService);
    this.type = Resource;

    this.transformFields = {
      createdBy: 'created_by',
    };
  }

  async getOne(
    where: ResourceWhereInput,
    info: GraphQLResolveInfo,
  ): Promise<Resource> {
    return knex
      .from('studihub.resource')
      .select(...this.getFieldList(info))
      .andWhere({ id: where.id })
      .first()
      .then(row => plainToClass(Resource, row));
  }

  async getMany(
    args: ResourcesArgs,
    info?: GraphQLResolveInfo,
  ): Promise<Resource[]> {
    return await this.createQueryBuilder(args, info).then(rows =>
      rows.map(row => plainToClass(Resource, row)),
    );
  }

  async getCount(args: ResourcesArgs): Promise<number> {
    return this.createQueryBuilder(args)
      .count()
      .clearOrder()
      .clear('offset')
      .first()
      .then(row => +row.count);
  }

  private createQueryBuilder(
    args: ResourcesArgs,
    info?: GraphQLResolveInfo,
  ): Knex.QueryBuilder {
    const qb = knex.from({
      r: 'studihub.resource',
    });

    if (info) {
      qb.select(this.getFieldList(info));
    }

    if (args?.where?.text) {
      qb.andWhere('r.name', 'ilike', `%${args?.where?.text}%`);
    }

    if (args?.where?.id) {
      qb.where('r.id', '=', args?.where?.id);
    }

    if (args.skip) {
      qb.offset(args.skip);
    }

    if (args.first) {
      qb.limit(args.first);
    }

    if (args.orderBy) {
      _.forIn(args.orderBy, (value, key) => {
        qb.orderBy(
          classTransformerDefaultMetadataStorage.findExposeMetadata(
            Resource,
            key,
          )?.options?.name || key,
          value,
        );
      });
    }

    return qb;
  }

  async create(
    data: ResourceCreateInput,
    ctx: Context,
    info: GraphQLResolveInfo,
  ): Promise<typeof ResourceOrError> {
    return writer.transaction(async trx => {
      return await trx
        .from('studihub.resource')
        .insert({
          name: data.name,
          created_by: ctx.user?.id,
        })
        .returning(this.getFieldList(info))
        .then(rows => plainToClass(Resource, rows[0]))
        .catch(e => {
          if (e.code === PostgreErrorCode.UNIQUE_VIOLATION) {
            return ErrorFactory.createForbiddenError('Role name already exist');
          }

          return ErrorFactory.createInternalServerError();
        });
    });
  }

  async update(
    where: ResourceWhereInput,
    data: ResourceCreateInput,
    info: GraphQLResolveInfo,
  ): Promise<typeof ResourceOrError> {
    return writer.transaction(async trx => {
      return await trx
        .from('studihub.resource')
        .update({
          name: data.name,
          updated_at: new Date(),
        })
        .where({ id: where.id })
        .returning(this.getFieldList(info))
        .then(rows => plainToClass(Resource, rows[0]))
        .catch(e => {
          if (e.code === PostgreErrorCode.UNIQUE_VIOLATION) {
            return ErrorFactory.createForbiddenError('Role name already exist');
          }

          return ErrorFactory.createInternalServerError();
        });
    });
  }

  async delete(
    where: ResourceWhereInput,
    info?: GraphQLResolveInfo,
  ): Promise<Resource> {
    return await writer.transaction(async trx => {
      const resource = await trx
        .from({ r: 'studihub.resource' })
        .where({
          id: where.id,
        })
        .delete()
        .returning(['id', ...this.getFieldList(info)])
        .then(rows => plainToClass(Resource, rows[0]));

      await trx
        .from({ r: 'studihub.role_resource' })
        .where({
          resource_id: resource['id'],
        })
        .delete();

      await trx
        .from({ r: 'studihub.resource_api' })
        .where({
          resource_id: resource['id'],
        })
        .delete();

      await trx
        .from({ r: 'studihub.user_resource' })
        .where({
          resource_id: resource['id'],
        })
        .delete();

      await trx
        .from({ r: 'studihub.user_resource_api' })
        .where({
          resource_id: resource['id'],
        })
        .delete();

      return resource;
    });
  }
}
