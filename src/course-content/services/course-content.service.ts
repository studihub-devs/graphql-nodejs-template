import { injectable } from 'inversify';
import { GraphQLResolveInfo } from 'graphql';
import { plainToClass } from 'class-transformer';
import { defaultMetadataStorage as classTransformerDefaultMetadataStorage } from 'class-transformer/cjs/storage';
import { Knex } from 'knex';
import _ from 'lodash';
import { BaseService } from '../../core/services/base.service';
import { CacheService } from '../../shared/services/cache.service';
import { Context } from '../../core/types/context';
import knex, { writer } from '../../knex';

import { CourseContent } from '../entities/course-content.entity';
import { CourseContentWhereInput } from '../types/course-content-where.input';
import { CourseContentArgs } from '../types/course-content.args';
import { CourseContentRelayConnection } from '../types/course-content.relay-connection';
import { OrderBy } from '../../shared/types/order-by';
import { encodeCursor, paginate } from '../../utils/cursor-buffer';
import { UpdateCourseContentInput } from '../types/update-course-content.input';
import { CourseContentOrError } from '../types/course-content-or-error';
import { CourseContentError } from '../types/course-content-error';
import { CourseContentErrorCode } from '../types/course-content-error-code';
import { ErrorStatus } from '../../core/types/error-status';
import { ErrorFactory } from '../../core/services/error-factory';
import { S3File } from '../../s3-file/entities/s3-file.entity';
import { S3Service } from '../../shared/services/s3.service';
import { FixedSize } from '../../s3-file/types/fixed-size';
import { S3FileCreateInput } from '../../s3-file/types/create-s3-file.input';
import { S3FileService } from '../../s3-file/services/s3-file.service';
import { InsertCourseContentInput } from '../types/insert-course-content.input';
import { CourseContentStatus } from '../types/course-content-status';
import { UpdateCourseContentSeqInput } from '../types/update-course-content-seq.input';

@injectable()
export class CourseContentService extends BaseService<CourseContent> {
  constructor(
    readonly cacheService: CacheService,
    private s3Service: S3Service,
    private s3FileService: S3FileService,
    ) {
    super(cacheService);
    this.type = CourseContent;
    this.transformFields = {
      // attachFiles: 'id',
      quizzes: 'id',
      childContents: 'id',
      video: 'video_id',
      file: 'file_id',
    };
  }

  async getOne(
    where: CourseContentWhereInput,
    info: GraphQLResolveInfo,
  ): Promise<CourseContent> {
    return knex
      .from('studihub.course_content')
      .where({ id: where.id })
      .select(...this.getFieldList(info))
      .first()
      .then(row => plainToClass(CourseContent, row));
  }

  async getMany(
    args: CourseContentArgs,
    info?: GraphQLResolveInfo,
    ctx?: Context,
  ): Promise<CourseContent[]> {
    return await this.createQueryBuilder(args, info, ctx).then(rows =>
      rows.map(row => plainToClass(CourseContent, row)),
    );
  }

  async getManyRelay(
    args: CourseContentArgs,
    ctx?: Context,
  ): Promise<CourseContentRelayConnection> {
    const totalCount = await this.getCount(args);

    // Set a default orderBy if not provided, to ensure proper sorting
    if (!args.after && !args.before && !args.orderBy) {
      args.orderBy = { id: OrderBy.ASC }; // Default ordering by 'id'
    }

    const courseContents = await this.createQueryBuilderCursor(args, ctx).then(rows =>
      rows.map(row => plainToClass(CourseContent, row)),
    );

    const paginatedCourses = paginate(
      courseContents,
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

    return plainToClass(CourseContentRelayConnection, {
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

  async getCount(args: CourseContentArgs): Promise<number> {
    return this.createQueryBuilder(args)
      .count()
      .clearOrder()
      .clear('offset')
      .first()
      .then(row => +row.count);
  }

  createQueryBuilderCursor(args: CourseContentArgs, ctx?: Context): Knex.QueryBuilder {
    const qb = this.createQueryBuilder(args)
      .clear('select')
      .clear('limit')
      .clear('offset');

    const fieldsList = args.orderBy
      ? Object.keys(args.orderBy).map(
          key => `cc.${
            classTransformerDefaultMetadataStorage.findExposeMetadata(
              CourseContent,
              key,
            )?.options?.name || key }`,
        )
      : ['cc.id']; // Select id field if no orderBy is provided

    qb.select(fieldsList);

    return qb;
  }

  createQueryBuilder(
    args: CourseContentArgs,
    info?: GraphQLResolveInfo,
    ctx?: Context,
  ): Knex.QueryBuilder {
    const qb = knex.from({ cc: 'studihub.course_content' });

    if (info) {
      qb.select(this.getFieldList(info, { prefix: 'cc'}));
    }

    if (args.where?.id) {
      qb.andWhere('cc.id', args.where?.id);
    }

    if (args.where?.courseId) {
      qb.andWhere('cc.course_id', args.where?.courseId);
    }

    if (args.where?.parentId) {
      qb.andWhere('cc.parent_id', args.where?.parentId);
    } else {
      qb.andWhereRaw(`cc.parent_id is null`)
    }

    if (args.where?.title) {
      qb.andWhere('cc.category_id', 'ilike', `%${args.where?.title}%`);
    }

    if (args.where?.userId) {
      switch (args.where?.roleId.toString()) {
        case process.env.TEACHER_ROLE:
          qb.innerJoin({ c: 'studihub.course' }, 'c.id', 'cc.course_id')
          .andWhere(function() {
            this.orWhereRaw(`(c.teacher_id = ${args.where?.userId} and cc.status is not null)`).orWhereRaw(
              `(c.teacher_id != ${args.where?.userId} and cc.status = '${CourseContentStatus.APPROVED}')`,
            );
          });
          break;
        case process.env.ADMIN_ROLE:
          break;
        default:
          qb.andWhere('cc.status', CourseContentStatus.APPROVED);
          break;
      }
    } else {
      qb.andWhere('cc.status', CourseContentStatus.APPROVED);
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
        qb.orderBy(`cc.${
          classTransformerDefaultMetadataStorage.findExposeMetadata(
            CourseContent,
            key,
          )?.options?.name || key }`,
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
    data: UpdateCourseContentInput,
    where: CourseContentWhereInput,
    info: GraphQLResolveInfo,
    ctx: Context,
  ): Promise<typeof CourseContentOrError> {
    if (ctx.user?.roleId.toString() != process.env.ADMIN_ROLE) {
      return new CourseContentError({
        message: 'You can not mutate this course content',
        code: CourseContentErrorCode.CAN_NOT_MUTATE_COURSE_CONTENT,
        status: ErrorStatus.FORBIDDEN,
      });
    }
    return writer.transaction(async trx => {
      const result = await trx
        .from('studihub.course_content')
        .update({
          status: data.status,
          updated_at: new Date(),
        })
        .whereIn('id', where.ids)
        .returning(this.getFieldList(info))
        .then(rows => plainToClass(CourseContent, rows[0]))
        .catch(e => {
          throw ErrorFactory.createInternalServerError();
        });
      return result;
    });
  }

  async delete(
    where: CourseContentWhereInput,
    info: GraphQLResolveInfo,
    ctx: Context,
  ): Promise<typeof CourseContentOrError> {
    return writer.transaction(async trx => {
      const s3Files = await trx          
        .from('studihub.s3_file')
        .del()
        .returning('*')
        .whereIn('id', function() {
          this.from('studihub.course_content')
            .select('video_id')
            .where({
              id: where.id,
            });
        })
        .orWhereIn('id', function() {
          this.from('studihub.course_content')
            .select('file_id')
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
        .from('studihub.course_content')
        .where('id', where.id)
        .del()
        .returning(this.getFieldList(info))
        .then(rows => plainToClass(CourseContent, rows[0]))
        .catch(e => {
          throw ErrorFactory.createInternalServerError();
        });

      return course;
    });
  }

  async update(
    data: UpdateCourseContentInput,
    where: CourseContentWhereInput,
    info: GraphQLResolveInfo,
    ctx: Context,
  ): Promise<typeof CourseContentOrError> {
    return writer.transaction(async trx => {
      let s3FilesUpdate: S3FileCreateInput[] = [];
      let s3Files: S3File[] = [];
      
      if (data?.video && !data?.video?.id) {        
        const video = await trx
          .from({ f: 'studihub.s3_file'})
          .del()
          .returning('*')
          .whereIn('id', function() {
            this.from('studihub.course_content')
              .select('video_id')
              .where({
                id: where?.id,
              });
          })
          .then(rows => plainToClass(S3File, rows[0]));

        if (video) {
          await this.s3Service.deleteObjects(
            [video.url],
            [FixedSize.SMALL, FixedSize.MEDIUM, FixedSize.LARGE],
          );
        }       

        s3FilesUpdate.push(data.video)
      }

      if (data.file && _.isNil(data?.file?.id)) {
        const file = await trx
          .from('studihub.s3_file')
          .del()
          .returning('*')
          .whereIn('id', function() {
            this.from('studihub.course_content')
              .select('file_id')
              .where({
                id: where.id,
              });
          })
          .then(rows => plainToClass(S3File, rows[0]));
        if (file) {
          await this.s3Service.deleteObjects(
            [file.url],
            [FixedSize.SMALL, FixedSize.MEDIUM, FixedSize.LARGE],
          );
        }

        s3FilesUpdate.push(data.file)
      }
     
      if (s3FilesUpdate?.length > 0) {
        s3Files = await this.s3FileService.createMany(s3FilesUpdate, trx)
      }

      const videoId = data.video?.id | (
        data.video && s3Files.length ? s3Files.find(e => e.name == data.video.name).id : undefined
      );

      const fileId = data.file?.id | (
        data.file && s3Files.length > 0 ? s3Files.find(e => e.name == data.file.name).id : undefined
      );

      const courseContent = await trx
        .from('studihub.course_content')
        .update({          
          title: data.title,
          seq_id: data.seqId,
          description: data.description,
          content: data.content,
          duration: data.duration,
          content_type: data.contentType,
          video_id: videoId,                    
          file_id: fileId,          
          updated_at: new Date(),
        })
        .where('id', where?.id)
        .returning(this.getFieldList(info))
        .then(rows => plainToClass(CourseContent, rows[0]));
      return courseContent;
    });
  }

  async create(
    data: InsertCourseContentInput,
    info: GraphQLResolveInfo,
    ctx: Context,
  ): Promise<typeof CourseContentOrError> {
    return writer
      .transaction(async trx => {
        let s3FilesInput: S3FileCreateInput[] = [];
        let s3Files: S3File[] = [];
        
        if(data?.video) {
          s3FilesInput.push(data.video);
        }

        if(data?.file) {
          s3FilesInput.push(data?.file);
        }    

        if(s3FilesInput?.length > 0) {
          s3Files = await this.s3FileService.createMany(s3FilesInput, trx)
        }       

        const courseContent = await trx
          .from('studihub.course_content')
          .insert({           
            title: data.title,
            course_id: data.courseId,
            seq_id: data.seqId,
            description: data.description,
            content: data.content,
            content_type: data.contentType,
            duration: data.duration,
            status: CourseContentStatus.CREATED,
            parent_id: data.parentId,
            video_id: data.video? s3Files.find(e => e.name == data.video.name).id : undefined, 
            file_id: data.file? s3Files.find(e => e.name == data.file.name).id : undefined,            
          })
          .returning(this.getFieldList(info))
          .then(rows => plainToClass(CourseContent, rows[0]));  

        return courseContent;
      })
      .catch(e => {        
        throw ErrorFactory.createInternalServerError();
      });
  }

  async mutateSeq(
    data: UpdateCourseContentSeqInput[],    
    info: GraphQLResolveInfo,
    ctx: Context,
  ): Promise< typeof CourseContentOrError> {
    return writer.transaction(async trx => { 
      const queries = [];
      data.map(dt => {
        const query = knex.from('studihub.course_content')
            .where('id', dt.contentId)
            .update({
              seq_id: dt.seqId,
              updated_at: new Date(), 
            })
            .returning(this.getFieldList(info))           
            .transacting(trx); 
        queries.push(query);
      });

      return Promise.all(queries) 
        .then(rows => plainToClass(CourseContent,  rows[0][0]))        
        .catch(e => {         
          throw ErrorFactory.createInternalServerError();
        });      
    });
  }
}
