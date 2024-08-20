import { injectable } from 'inversify';
import { GraphQLResolveInfo } from 'graphql';
import _ from 'lodash';
import { Knex } from 'knex';
import { plainToClass } from 'class-transformer';
import { defaultMetadataStorage as classTransformerDefaultMetadataStorage } from 'class-transformer/cjs/storage';

import { APIResource } from '../entities/api-resource.entity';
import { BaseService } from '../../../core/services/base.service';
import { CacheService } from '../../../shared/services/cache.service';
import { APIResourceCreateInput } from '../types/api-resource-create.input';
import { Context } from '../../../core/types/context';
import { APIResourceOrError } from '../types/api-resource-or-error';
import knex, { writer } from '../../../knex';
import { PostgreErrorCode } from '../../../core/exceptions/postgre-error-code';
import { ErrorFactory } from '../../../core/services/error-factory';
import { APIResourceWhereInput } from '../types/api-resource-where.input';
import { APIResourceUpdateInput } from '../types/api-resource-update.input';
import { APIResourceArgs } from '../types/api-resource.args';

@injectable()
export class APIResouceService extends BaseService<APIResource> {
  constructor(readonly cacheService: CacheService) {
    super(cacheService);
    this.type = APIResource;
    this.transformFields = {
      createdBy: 'created_by',
      resource: 'resource_id',
    };
  }

  async getOne(
    where: APIResourceWhereInput,
    info: GraphQLResolveInfo,
  ): Promise<APIResource> {
    return knex
      .from('studihub.api_resource')
      .select(...this.getFieldList(info))
      .andWhere({ id: where.id })
      .first()
      .then(row => plainToClass(APIResource, row));
  }

  async getMany(
    args: APIResourceArgs,
    info: GraphQLResolveInfo,
  ): Promise<APIResource[]> {
    return this.createQueryBuilder(args).then(rows =>
      rows.map(row => plainToClass(APIResource, row)),
    );
  }

  async getCount(args: APIResourceArgs): Promise<number> {
    return this.createQueryBuilder(args)
      .count()
      .clearOrder()
      .clear('offset')
      .first()
      .then(row => +row.count);
  }

  private createQueryBuilder(
    args: APIResourceArgs,
    info?: GraphQLResolveInfo,
  ): Knex.QueryBuilder {
    const qb = knex.from({
      ar: 'studihub.api_resource',
    });

    if (info) {
      qb.select(this.getFieldList(info));
    }

    if (args?.where?.text) {
      qb.whereRaw(`ar.name ilike '%${args.where?.text}%'`);
    }

    if (args?.where?.id) {
      qb.where('ar.id', '=', args?.where?.id);
    }

    if (args?.where?.resourceId) {
      qb.where('ar.resource_id', '=', args?.where?.resourceId);
    }

    if (args.orderBy) {
      _.forIn(args.orderBy, (value, key) => {
        qb.orderBy(
          classTransformerDefaultMetadataStorage.findExposeMetadata(
            APIResource,
            key,
          )?.options?.name || key,
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

  async create(
    data: APIResourceCreateInput,
    ctx: Context,
    info: GraphQLResolveInfo,
  ): Promise<typeof APIResourceOrError> {
    return writer
      .transaction(async trx => {
        const api = await trx
          .from('studihub.api_resource')
          .insert({
            name: data.name,
            name_code: data.nameCode,
            resource_id: data.resourceId,
            method: data.method,
            url_path: data.urlPath,
            created_by: ctx.user?.id,
          })
          .returning(this.getFieldList(info))
          .then(rows => plainToClass(APIResource, rows[0]));

        // if (resourceApi['id']) {
        //   const userResources = await trx
        //     .from({ ur: 'reviewtydev.user_resource' })
        //     .innerJoin({ u: 'reviewtydev.user' }, 'u.id', 'ur.user_id')
        //     .select('ur.user_id')
        //     .where('u.user_path', '=', `/${currentUser.id}/`)
        //     .where('ur.resource_id', '=', resourceApi.resourceId)
        //     .where('ur.status', '=', RoleStatus.ACTIVE);

        //   if (userResources.length > 0) {
        //     const new_apis = userResources.map(r => {
        //       const user_resource_api = new UserResourceAPI();
        //       user_resource_api['userId'] = r['user_id'];
        //       user_resource_api['resourceId'] = resourceApi.resourceId;
        //       user_resource_api['apiId'] = resourceApi['id'];
        //       user_resource_api['status'] = RoleStatus.ACTIVE;

        //       return user_resource_api;
        //     });

        //     await trx
        //       .from('reviewtydev.user_resource_api')
        //       .insert(
        //         new_apis.map(dt => ({
        //           user_id: dt['userId'],
        //           resource_id: dt['resourceId'],
        //           api_id: dt['apiId'],
        //           status: dt['status'],
        //         })),
        //       )
        //       .onConflict(['user_id', 'resource_id', 'api_id'])
        //       .merge();
        //   }
        // }

        return api;
      })
      .catch(e => {
        if (e.code === PostgreErrorCode.UNIQUE_VIOLATION) {
          return ErrorFactory.createForbiddenError(
            'name or nameCode is already existed',
          );
        } else {
          return ErrorFactory.createInternalServerError();
        }
      });
  }

  async update(
    where: APIResourceWhereInput,
    data: APIResourceUpdateInput,
    info?: GraphQLResolveInfo,
    ctx?: Context,
  ): Promise<typeof APIResourceOrError> {
    return writer
      .transaction(async trx => {
        const api = await trx
          .from('studihub.api_resource')
          .update(
            _.omitBy(
              {
                name: data.name,
                resource_id: data.resourceId,
                name_code: data.nameCode,
                method: data.method,
                url_path: data.urlPath,
                updated_at: new Date(),
              },
              _.isUndefined,
            ),
          )
          .where({ id: where.id })
          .returning(this.getFieldList(info))
          .then(rows => plainToClass(APIResource, rows[0]));

        // if (data.resourceId && resourceApi['id']) {
        //   const user_resource_api = await trx
        //     .withSchema('reviewtydev')
        //     .from('user_resource_api')
        //     .select('*')
        //     .where({ api_id: where.id });
        //   if (user_resource_api) {
        //     await trx
        //       .withSchema('reviewtydev')
        //       .from('user_resource_api')
        //       .update({ resource_id: resourceApi['resourceId'] })
        //       .where({ api_id: where.id });
        //   }
        // }

        return api;
      })
      .catch(e => {
        if (e.code === PostgreErrorCode.UNIQUE_VIOLATION) {
          return ErrorFactory.createForbiddenError(
            'name or nameCode is already existed',
          );
        } else {
          return ErrorFactory.createInternalServerError();
        }
      });
  }

  async delete(
    where: APIResourceWhereInput,
    info?: GraphQLResolveInfo,
  ): Promise<APIResource> {
    return await writer.transaction(async trx => {
      const api = await trx
        .from('studihub.api_resource')
        .where({
          id: where.id,
        })
        .del()
        .returning(['id', ...this.getFieldList(info)])
        .then(rows => plainToClass(APIResource, rows[0]));

      // await trx
      //   .from({ r: 'studihub.user_resource_api' })
      //   .where({
      //     api_id: api['id'],
      //   })
      //   .del();

      return api;
    });
  }
}
