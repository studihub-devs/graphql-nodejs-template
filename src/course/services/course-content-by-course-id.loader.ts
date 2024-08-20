import DataLoader from 'dataloader';
import { plainToClass } from 'class-transformer';
import hash from 'object-hash';
import { SelectLoaderKey } from '../../core/dataloader/select-loader-key';
import knex from '../../knex';
import { CourseContent } from '../../course-content/entities/course-content.entity';
import { CourseContentStatus } from '../../course-content/types/course-content-status';
import { CourseContentArgs } from '../../course-content/types/course-content.args';


interface CourseContentByCourseIdLoaderKey extends SelectLoaderKey<number> {
  args: CourseContentArgs;
};
export type CourseContentByCourseIdLoader = DataLoader<
  CourseContentByCourseIdLoaderKey,
  CourseContent[],
  string
>;

export const createCourseContentByCourseIdLoader = (): CourseContentByCourseIdLoader =>
  new DataLoader<CourseContentByCourseIdLoaderKey, CourseContent[], string>(
    async keys => {
      const ids = keys.map(key => key.id);
      const args = keys[0].args;

      const sqb = knex
        .from({
          cc: 'studihub.course_content',
        })
        .select(keys[0].fields)
        .where({
          'cc.course_id': knex.ref('c.id'),
        })

        if (args?.where?.userId) {
          switch (args?.where?.roleId.toString()) {
            case process.env.TEACHER_ROLE:  
              sqb.andWhere(function() {
                this.orWhereRaw(`(c.teacher_id = ${args?.where?.userId} and cc.status is not null)`).orWhereRaw(
                  `(c.teacher_id != ${args?.where?.userId} and cc.status = '${CourseContentStatus.APPROVED}')`,
                );
              });
              break;
            case process.env.ADMIN_ROLE:
              break;
            default:
              sqb.andWhere('cc.status', CourseContentStatus.APPROVED);
              break;
          }
        } else {
          sqb.andWhere('cc.status', CourseContentStatus.APPROVED);
        }

        if (args.where?.parentId) {
          sqb.andWhere('cc.parent_id', args.where?.parentId);
        } else {
          sqb.andWhereRaw(`cc.parent_id is null`)
        }

      const rows = await knex
        .from({ c: 'studihub.course' })
        .joinRaw(
          `LEFT JOIN LATERAL (${sqb.toQuery()}) AS cc ON true`,
        )
        .select('c.id', knex.raw('JSON_AGG(cc) AS contents'))
        .whereIn('c.id', ids)
        .groupBy('c.id')
        .orderByRaw(`idx(array[${ids}], c.id)`);
      return rows.map(
        row =>
          row.contents
            ?.filter(c => !!c)
            ?.map(c => plainToClass(CourseContent, c)) || [],
      );
    },
    {
      cacheKeyFn: (key): string => hash(key),
    },
  );
