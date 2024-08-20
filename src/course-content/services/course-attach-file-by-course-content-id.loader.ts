import DataLoader from 'dataloader';
import { plainToClass } from 'class-transformer';
import hash from 'object-hash';
import { SelectLoaderKey } from '../../core/dataloader/select-loader-key';
import knex from '../../knex';
import { CourseContent } from '../entities/course-content.entity';
import { CourseAttachFile } from '../../course-attach-file/entities/course-attach-file.entity';

export type CourseAttachFileByCourseContentIdLoaderKey = SelectLoaderKey<
  CourseContent['id']
>;
export type CourseAttachFileByCourseContentIdLoader = DataLoader<
  CourseAttachFileByCourseContentIdLoaderKey,
  CourseAttachFile[],
  string
>;

export const createCourseAttachFileByCourseContentIdLoader = (): CourseAttachFileByCourseContentIdLoader =>
  new DataLoader<
    CourseAttachFileByCourseContentIdLoaderKey,
    CourseAttachFile[],
    string
  >(
    async keys => {
      const ids = keys.map(key => key.id);
      const rows = await knex
        .from({ cc: 'studihub.course_content' })
        .joinRaw(
          `LEFT JOIN LATERAL (${knex
            .from({
              caf: 'studihub.course_attach_file',
            })
            .select(keys[0].fields)
            .where({
              'caf.content_id': knex.ref('cc.id'),
            })
            .toQuery()}) AS af ON true`,
        )
        .select('cc.id', knex.raw('JSON_AGG(af) AS files'))
        .whereIn('cc.id', ids)
        .groupBy('cc.id')
        .orderByRaw(`idx(array[${ids}], cc.id)`);
      return rows.map(
        row =>
          row.files
            ?.filter(f => !!f)
            ?.map(f => plainToClass(CourseAttachFile, f)) || [],
      );
    },
    {
      cacheKeyFn: (key): string => hash(key),
    },
  );
