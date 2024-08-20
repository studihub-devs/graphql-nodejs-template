import DataLoader from 'dataloader';
import { plainToClass } from 'class-transformer';
import hash from 'object-hash';
import { SelectLoaderKey } from '../../core/dataloader/select-loader-key';
import knex from '../../knex';
import { Quiz } from '../../quiz/entities/quiz.entity';
import { QuizStatus } from '../../quiz/types/quiz-status';
import { QuizArgs } from '../../quiz/types/quiz.args';

interface QuizByCourseContentIdLoaderKey extends SelectLoaderKey<number> {
  args: QuizArgs;
};

export type QuizByCourseContentIdLoader = DataLoader<
  QuizByCourseContentIdLoaderKey,
  Quiz[],
  string
>;

export const createQuizByCourseContentIdLoader = (): QuizByCourseContentIdLoader =>
  new DataLoader<QuizByCourseContentIdLoaderKey, Quiz[], string>(
    async keys => {
      const ids = keys.map(key => key.id);
      const args = keys[0].args;

      const sqb = knex
        .from({
          q: 'studihub.quiz',
        })
        .select(['q.status', ...keys[0].fields])
        .andWhere({
          'q.course_content_id': knex.ref('cc.id'),
        });        

        if (args?.where?.userId) {
          switch (args?.where?.roleId.toString()) {
            case process.env.TEACHER_ROLE:  
              sqb.andWhere(function() {
                this.orWhereRaw(`(c.teacher_id = ${args?.where?.userId} and q.status is not null)`).orWhereRaw(
                  `(c.teacher_id != ${args?.where?.userId} and q.status = '${QuizStatus.APPROVED}')`,
                );
              });
              break;
            case process.env.ADMIN_ROLE:
              break;
            default:
              sqb.andWhere('q.status', QuizStatus.APPROVED);
              break;
          }
        } else {
          sqb.andWhere('q.status', QuizStatus.APPROVED);
        }       
        
      const rows = await knex
        .from({ cc: 'studihub.course_content' })
        .innerJoin({ c: 'studihub.course' }, 'c.id', 'cc.course_id')
        .joinRaw(
          `LEFT JOIN LATERAL (${sqb.toQuery()}) AS q ON true`,
        )       
        .select('cc.id', knex.raw('JSON_AGG(q) AS quizzes'))
        .whereIn('cc.id', ids)
        .groupBy('cc.id')
        .orderByRaw(`idx(array[${ids}], cc.id)`);
      return rows.map(
        row =>
          row.quizzes?.filter(q => !!q)?.map(q => plainToClass(Quiz, q)) || [],
      );
    },
    {
      cacheKeyFn: (key): string => hash(key),
    },
  );
