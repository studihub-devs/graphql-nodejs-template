import { injectable } from 'inversify';
import { GraphQLResolveInfo } from 'graphql';
import { plainToClass } from 'class-transformer';
import { defaultMetadataStorage as classTransformerDefaultMetadataStorage } from 'class-transformer/cjs/storage';
import { Knex } from 'knex';
import { RoleResource } from '../entities/role-resource.entity';
import { RoleResourceArgs } from '../types/role-resource-args';
import _ from 'lodash';
import { BaseService } from '../../../core/services/base.service';
import { CacheService } from '../../../shared/services/cache.service';
import { Context } from '../../../core/types/context';
import knex from '../../../knex';

@injectable()
export class RoleResourceService extends BaseService<RoleResource> {
  constructor(readonly cacheService: CacheService) {
    super(cacheService);
    this.type = RoleResource;
    this.transformFields = {
      createdBy: 'created_by',
      resource: 'resource_id',
    };
  }
  // async create(
  //   data: RoleResourceCreateInput,
  //   info: GraphQLResolveInfo,
  //   ctx: Context,
  // ): Promise<RoleResource> {
  //   return writer.transaction(async trx => {
  //     if (data.roleResourceData?.length) {
  //       const result = await trx
  //         .from('csssystem.role_resource')
  //         .insert(
  //           data.roleResourceData.map(rrs => ({
  //             role_id: data.roleId,
  //             resource_id: rrs.resourceId,
  //             created_by: ctx?.user?.id,
  //             status: rrs.status,
  //           })),
  //         )
  //         .transacting(trx)
  //         .onConflict(['role_id', 'resource_id'])
  //         .merge()
  //         .returning(this.getFieldList(info))
  //         .then(rows => plainToClass(RoleResource, rows[0]));

  //       const users = await trx
  //         .select('u.id')
  //         .from({ u: 'reviewtydev.user' })
  //         .where('u.role_id', '=', data.roleId)
  //         .where('u.user_path', '=', `/${ctx.admin.id}/`)
  //         .where({ 'u.delete_reason': null })
  //         .then(row => {
  //           return plainToClass(User, row);
  //         });

  //       if (data.roleResourceData[0].status) {
  //         const apis = await trx
  //           .select('ra.id')
  //           .from({ ra: 'reviewtydev.resource_api' })
  //           .where('ra.resource_id', '=', data.roleResourceData[0].resourceId)
  //           .returning('id');

  //         const new_apis = [];
  //         if (users.length > 0) {
  //           const new_resources = users.map(r => {
  //             const user_resource = new UserResource();
  //             user_resource['userId'] = r.id;
  //             user_resource['resourceId'] = data.roleResourceData[0].resourceId;
  //             user_resource['status'] = RoleStatus.ACTIVE;

  //             if (apis) {
  //               apis.map(api => {
  //                 const resource_api = new UserResourceAPI();
  //                 resource_api['userId'] = r.id;
  //                 resource_api['resourceId'] =
  //                   data.roleResourceData[0].resourceId;
  //                 resource_api['apiId'] = api.id;
  //                 resource_api['status'] = RoleStatus.ACTIVE;

  //                 new_apis.push(resource_api);
  //               });
  //             }

  //             return user_resource;
  //           });

  //           if (new_apis.length > 0) {
  //             await trx
  //               .from('reviewtydev.user_resource_api')
  //               .insert(
  //                 new_apis.map(dt => ({
  //                   user_id: dt['userId'],
  //                   resource_id: dt['resourceId'],
  //                   api_id: dt['apiId'],
  //                   status: dt['status'],
  //                 })),
  //               )
  //               .onConflict(['user_id', 'resource_id', 'api_id'])
  //               .merge();
  //           }

  //           await trx
  //             .from('reviewtydev.user_resource')
  //             .insert(
  //               new_resources.map(dt => ({
  //                 user_id: dt['userId'],
  //                 resource_id: dt['resourceId'],
  //                 status: dt['status'],
  //               })),
  //             )
  //             .onConflict(['user_id', 'resource_id'])
  //             .merge();
  //         }
  //       } else {
  //         await trx
  //           .from({ ur: 'reviewtydev.user_resource' })
  //           .where('ur.resource_id', '=', data.roleResourceData[0].resourceId)
  //           .andWhereRaw(
  //             `
  //               exists
  //                 ( select * from reviewtydev.user u
  //                   where u.role_id = ${data.roleId}
  //                   and u.user_path = '/${ctx.admin.id}/'
  //                   and u.delete_reason is null
  //                   and ur.user_id = u.id)`,
  //           )
  //           .del();

  //         await trx
  //           .from({ ura: 'reviewtydev.user_resource_api' })
  //           .where('ura.resource_id', '=', data.roleResourceData[0].resourceId)
  //           .andWhereRaw(
  //             `
  //               exists
  //                 ( select * from reviewtydev.user u
  //                   where u.role_id = ${data.roleId}
  //                   and u.user_path = '/${ctx.admin.id}/'
  //                   and u.delete_reason is null
  //                   and ura.user_id = u.id)`,
  //           )
  //           .del();
  //       }

  //       return result;
  //     }
  //   });
  // }

  // async delete(
  //   where: RoleResourceWhereUniqueInput,
  //   info: GraphQLResolveInfo,
  // ): Promise<RoleResource> {
  //   return writer.transaction(async trx => {
  //     const role = await trx
  //       .withSchema('reviewtydev')
  //       .from('role_resource')
  //       .whereIn('role_id', [where.resourceId])
  //       .del()
  //       .returning(this.getFieldList(info))
  //       .then(rows => plainToClass(RoleResource, rows[0]));
  //     return role;
  //   });
  // }

  // if role resource don't save => all resource with status null
  // if role resource is saved => all resource with status of role resource

  async getResourceByRoleId(
    args: RoleResourceArgs,
    info?: GraphQLResolveInfo,
    ctx?: Context,
  ): Promise<RoleResource[]> {
    return await this.createQueryBuilder(args, info).then(rows =>
      rows.map(row => plainToClass(RoleResource, row)),
    );
  }

  createQueryBuilder(
    args: RoleResourceArgs,
    info?: GraphQLResolveInfo,
  ): Knex.QueryBuilder {
    const qb = knex.from({ r: 'studihub.resource' });

    qb.select(
      knex.raw(`
      r.id as resource_id
      `),
    );

    if (args.where?.roleId) {
      qb.select(
        knex.raw(`
        rr.id, rr.role_id, rr.status
        `),
      );
      qb.leftOuterJoin({ rr: 'studihub.role_resource' }, builder =>
        builder
          .on('r.id', '=', 'rr.resource_id')
          .andOnVal('rr.role_id', args.where.roleId),
      );
    }

    if (args.orderBy) {
      _.forIn(args.orderBy, (value, key) => {
        qb.orderBy(
          classTransformerDefaultMetadataStorage.findExposeMetadata(
            RoleResource,
            key,
          )?.options?.name || key,
          value,
        );
      });
    }

    // if (args.skip) {
    //   qb.offset(args.skip);
    // }

    // if (args.first) {
    //   qb.limit(args.first);
    // }

    return qb;
  }
}
