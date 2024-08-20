import { plainToClass } from 'class-transformer';
import { defaultMetadataStorage as classTransformerDefaultMetadataStorage } from 'class-transformer/cjs/storage';
import { GraphQLResolveInfo } from 'graphql';
import { injectable } from 'inversify';
import { Knex } from 'knex';
import _ from 'lodash';
import { BaseService } from '../../core/services/base.service';
import { Context } from '../../core/types/context';
import knex, { writer } from '../../knex';

import { ErrorFactory } from '../../core/services/error-factory';
import { ErrorStatus } from '../../core/types/error-status';
import { CacheService } from '../../shared/services/cache.service';
import { OrderBy } from '../../shared/types/order-by';
import { encodeCursor, paginate } from '../../utils/cursor-buffer';
import { Course } from '../entities/course.entity';
import { CourseError } from '../types/course-error';
import { CourseErrorCode } from '../types/course-error-code';
import { CourseOrError } from '../types/course-or-error';
import { CourseStatus } from '../types/course-status';
import { CourseWhereInput } from '../types/course-where.input';
import { CourseArgs } from '../types/course.args';
import { CourseRelayConnection } from '../types/course.relay-connection';
import { InsertCourseInput } from '../types/insert-course.input';
import { UpdateCourseInput } from '../types/update-course.input';
import { S3FileCreateInput } from '../../s3-file/types/create-s3-file.input';
import { S3FileService } from '../../s3-file/services/s3-file.service';
import { S3File } from '../../s3-file/entities/s3-file.entity';
import { FixedSize } from '../../s3-file/types/fixed-size';
import { S3Service } from '../../shared/services/s3.service';

@injectable()
export class CourseService extends BaseService<Course> {
  constructor(
    readonly cacheService: CacheService,
    private s3FileService: S3FileService,
    private s3Service: S3Service,
  ) {
    super(cacheService);
    this.type = Course;
    this.transformFields = {
      teacher: 'teacher_id',
      contents: 'id',
      reactCount: 'id',
      reviewCount: 'id',
      averageRating: 'id',
      reviews: 'id',
      reacts: 'id',
      thumbnail: 'thumbnail_id',
      badgeImage: 'badge_image_id',
      viewerships: 'id',
      viewershipCount: 'id',
    };
  }

  async getOne(
    where: CourseWhereInput,
    info: GraphQLResolveInfo,
  ): Promise<Course> {
    return knex
      .from('studihub.course')
      .where({ id: where.id })
      .select(...this.getFieldList(info))
      .first()
      .then(row => plainToClass(Course, row));
  }

  async getMany(
    args: CourseArgs,
    ctx?: Context,
    info?: GraphQLResolveInfo,
  ): Promise<Course[]> {
    return await this.createQueryBuilder(args, ctx, info).then(rows =>
      rows.map(row => plainToClass(Course, row)),
    );
  }

  async getManyRelay(
    args: CourseArgs,
    ctx?: Context,
  ): Promise<CourseRelayConnection> {
    const totalCount = await this.getCount(args);

    // Set a default orderBy if not provided, to ensure proper sorting
    if (!args.after && !args.before && !args.orderBy) {
      args.orderBy = { id: OrderBy.ASC }; // Default ordering by 'id'
    }

    const courses = await this.createQueryBuilderCursor(args, ctx).then(rows =>
      rows.map(row => plainToClass(Course, row)),
    );

    const paginatedCourses = paginate(
      courses,
      args.before,
      args.after,
      args.first,
      args.last,
    );

    // Map the results to edges and cursors
    const edges = paginatedCourses.map(it => {
      const currObject = args.orderBy ? { ...args.orderBy } : {};
      if (args.orderBy) {
        Object.keys(args.orderBy).forEach(key => {
          currObject[key] = it[key];
        });
      }
      return {
        node: it,
        cursor: args.orderBy ? encodeCursor(JSON.stringify(currObject)) : null,
      };
    });

    const hasNextPage = args.first && paginatedCourses.length === args.first;
    const hasPreviousPage = args.last && paginatedCourses.length === args.last;

    return plainToClass(CourseRelayConnection, {
      totalCount,
      edges,
      pageInfo: {
        hasNextPage,
        hasPreviousPage,
        startCursor: edges.length > 0 ? edges[0].cursor : null,
        endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
      },
    });
  }

  async getCount(args: CourseArgs): Promise<number> {
    return this.createQueryBuilder(args)
      .count()
      .clearOrder()
      .clear('offset')
      .first()
      .then(row => +row.count);
  }

  createQueryBuilderCursor(args: CourseArgs, ctx?: Context): Knex.QueryBuilder {
    const qb = this.createQueryBuilder(args, ctx)
      .clear('select')
      .clear('limit')
      .clear('offset');

    const fieldsList = args.orderBy
      ? Object.keys(args.orderBy).map(
          key => `c.${
            classTransformerDefaultMetadataStorage.findExposeMetadata(
              Course,
              key,
            )?.options?.name || key }`,
        )
      : ['c.id']; // Select id field if no orderBy is provided

    qb.select(fieldsList);

    return qb;
  }

  createQueryBuilder(
    args: CourseArgs,
    ctx?: Context,
    info?: GraphQLResolveInfo,
  ): Knex.QueryBuilder {
    const qb = knex.from({ c: 'studihub.course' });

    if (info) {
      qb.select(this.getFieldList(info, { prefix: 'c'}));
    }

    if (args.where?.id) {
      qb.andWhere('c.id', args.where?.id);
    }

    if (args.where?.teacherId) {
      qb.andWhere('c.teacher_id', args.where?.teacherId);
    }

    if (args.where?.categoryFilter?.equals) {
      qb.andWhere('c.category_id', args.where?.categoryFilter?.equals);
    }
   
    if (args.where?.userId) {
      switch (args.where?.roleId.toString()) {
        case process.env.TEACHER_ROLE:
          qb.leftJoin(
            { uc: 'studihub.user_course' },
            'c.id',
            'uc.course_id',
          ).andWhere(function() {
            this.orWhere('c.teacher_id', '=', args.where?.userId).orWhereRaw(
              `(uc.user_id = ${args.where?.userId} and c.status = ${CourseStatus.APPROVED})`,
            );
          });
          break;
        case process.env.ADMIN_ROLE:
          break;
        default:
          qb.innerJoin({ uc: 'studihub.user_course' }, 'c.id', 'uc.course_id')
            .andWhere('uc.user_id', args.where?.userId)
            .andWhere('c.status', CourseStatus.APPROVED);
          break;
      }
    } else {
      qb.andWhere('c.status', CourseStatus.APPROVED);
    }

    // Set default orderBy if not provided
    if (!args.orderBy) {
      if (args.after) {
        args.orderBy = { id: OrderBy.ASC }; // Default to ASC if 'after' is used
      } else if (args.before) {
        args.orderBy = { id: OrderBy.DESC }; // Default to DESC if 'before' is used
      } else {
        args.orderBy = { id: OrderBy.ASC }; // Default to ASC if neither 'after' nor 'before' is used
      }
    }

    if (args.orderBy) {
      _.forIn(args.orderBy, (value, key) => {
        qb.orderBy(`c.${
          classTransformerDefaultMetadataStorage.findExposeMetadata(Course, key)
            ?.options?.name || key }`,
          value,
        );
      });
    }

    if (args.skip) {
      qb.offset(args.skip);
    }

    // Limit results based on first or last
    if (args.first) {
      qb.limit(args.first);
    } else if (args.last) {
      qb.limit(args.last);
    }

    return qb;
  }

  async mutateStatus(
    data: UpdateCourseInput,
    where: CourseWhereInput,
    info: GraphQLResolveInfo,
    ctx: Context,
  ): Promise<typeof CourseOrError> {
    if (ctx.user?.roleId.toString() != process.env.ADMIN_ROLE) {
      return new CourseError({
        message: 'You can not mutate this course',
        code: CourseErrorCode.CAN_NOT_MUTATE_COURSE,
        status: ErrorStatus.FORBIDDEN,
      });
    }
    return writer.transaction(async trx => {
      const result = await trx
        .from('studihub.course')
        .update({
          status: data.status,
          updated_at: new Date(),
        })
        .where('id', where.id)
        .returning(this.getFieldList(info))
        .then(rows => plainToClass(Course, rows[0]))
        .catch(e => {
          throw ErrorFactory.createInternalServerError();
        });
      return result;
    });
  }

  async delete(
    where: CourseWhereInput,
    info: GraphQLResolveInfo,
    ctx: Context,
  ): Promise<typeof CourseOrError> {
    return writer.transaction(async trx => {
      const s3Files = await trx          
        .from('studihub.s3_file')
        .del()
        .returning('*')
        .whereIn('id', function() {
          this.from('studihub.course')
            .select('thumbnail_id')
            .where({
              id: where.id,
            });
        })
        .orWhereIn('id', function() {
          this.from('studihub.course')
            .select('badge_image_id')
            .where({
              id: where.id,
            });
        })                 
        .then(rows => rows.map(row => plainToClass(S3File, row)));     

      if(s3Files.length > 0) {
        await this.s3Service.deleteObjects(
          s3Files.map(f => f.url),
          [FixedSize.SMALL, FixedSize.MEDIUM, FixedSize.LARGE],
        );
      }

      const course = await trx
        .from('studihub.course')
        .where('id', where.id)
        .del()
        .returning(this.getFieldList(info))
        .then(rows => plainToClass(Course, rows[0]))
        .catch(e => {
          throw ErrorFactory.createInternalServerError();
        });

      return course;
    });
  }

  async update(
    data: UpdateCourseInput,
    where: CourseWhereInput,
    info: GraphQLResolveInfo,
    ctx: Context,
  ): Promise<typeof CourseOrError> {
    return writer.transaction(async trx => {
      let s3FilesUpdate: S3FileCreateInput[] = [];
      let s3Files: S3File[] = [];
      
      if(data?.thumbnail && !data?.thumbnail?.id) {        
        const thumbnail = await trx
          .from({ f: 'studihub.s3_file'})
          .del()
          .returning('*')
          .whereIn('id', function() {
            this.from('studihub.course')
              .select('thumbnail_id')
              .where({
                id: where?.id,
              });
          })
          .then(rows => plainToClass(S3File, rows[0]));

        if(thumbnail) {
          await this.s3Service.deleteObjects(
            [thumbnail.url],
            [FixedSize.SMALL, FixedSize.MEDIUM, FixedSize.LARGE],
          );
        }       

        s3FilesUpdate.push(data.thumbnail)
      }

      if(data.badgeImage && _.isNil(data?.badgeImage?.id)) {
        const badgeImage = await trx
          .from('studihub.s3_file')
          .del()
          .returning('id')
          .whereIn('id', function() {
            this.from('studihub.course')
              .select('badge_image_id')
              .where({
                id: where.id,
              });
          })
          .then(rows => plainToClass(S3File, rows[0]));
        if(badgeImage) {
          await this.s3Service.deleteObjects(
            [badgeImage.url],
            [FixedSize.SMALL, FixedSize.MEDIUM, FixedSize.LARGE],
          );
        }

        s3FilesUpdate.push(data.badgeImage)
      }
     
      if(s3FilesUpdate?.length > 0) {
        s3Files = await this.s3FileService.createMany(s3FilesUpdate, trx)
      }

      const thumbnailId = data.thumbnail?.id | (
        data.thumbnail && s3Files.length ? s3Files.find(e => e.name == data.thumbnail.name).id : undefined
      );

      const badgeImageId = data.badgeImage?.id | (
        data.badgeImage && s3Files.length > 0 ? s3Files.find(e => e.name == data.badgeImage.name).id : undefined
      );

      const course = await trx
        .from('studihub.course')
        .update({
          name: data.name,
          title: data.title,
          duration: data.duration,
          type: data.type,
          category_id: data.categoryId,
          reward_point: data.rewardPoint,
          level: data.level,
          price: data.price,
          thumbnail_id: thumbnailId,          
          badge_image_id: badgeImageId,          
          updated_at: new Date(),
        })
        .where('id', where?.id)
        .returning(this.getFieldList(info))
        .then(rows => plainToClass(Course, rows[0]));
      return course;
    });
  }

  async create(
    data: InsertCourseInput,
    info: GraphQLResolveInfo,
    ctx: Context,
  ): Promise<typeof CourseOrError> {
    return writer
      .transaction(async trx => {
        let s3FilesInput: S3FileCreateInput[] = [];
        let s3Files: S3File[] = [];
        
        if(data.badgeImage) {
          s3FilesInput.push(data.badgeImage);
        }

        if(data.thumbnail) {
          s3FilesInput.push(data.thumbnail);
        }
        
        if (s3FilesInput.length > 0) {
          s3Files = await this.s3FileService.createMany(s3FilesInput, trx)
        } 

        const course = await trx
          .from('studihub.course')
          .insert({
            name: data.name,
            title: data.title,
            duration: data.duration,
            type: data.type,
            category_id: data.categoryId,
            reward_point: data.rewardPoint,
            level: data.level,
            price: data.price,
            status: CourseStatus.CREATED,
            teacher_id: ctx?.user?.id,
            created_by: ctx?.user?.id,
            thumbnail_id: data.thumbnail? s3Files.find(e => e.name == data.thumbnail.name).id : undefined,           
            badge_image_id: data.badgeImage? s3Files.find(e => e.name == data.badgeImage.name).id : undefined,            
          })
          .returning(this.getFieldList(info))
          .then(rows => plainToClass(Course, rows[0]));

        return course;
      })
      .catch(e => {
        throw ErrorFactory.createInternalServerError();
      });
  }
}
