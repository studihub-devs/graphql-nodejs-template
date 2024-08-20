// import { ForbiddenError } from 'apollo-server';
// import to from 'await-to-js';
// import { createMethodDecorator } from 'type-graphql';
// import { Context } from '../../core/types/context';
// import knex from '../../knex';

// export function CheckPermissions(name: string): MethodDecorator {
//   return createMethodDecorator<Context>(async ({ args, context }, next) => {
//     const user = context.user ? context.user : context.admin;
//     if (user.role.valueOf() != 'ADMIN') {
//       return next();
//     }

//     if (user.roleId.toString() == process.env.SUPPER_ADMIN_ROLE_ID.toString()) {
//       return next();
//     } else {
//       const [error, count] = await to(
//         knex
//           .from({ ur: 'reviewtydev.user_resource' })
//           .innerJoin({ ura: 'reviewtydev.user_resource_api' }, function() {
//             this.on('ur.user_id', '=', 'ura.user_id').andOn(
//               'ur.resource_id',
//               '=',
//               'ura.resource_id',
//             );
//           })
//           .innerJoin({ ra: 'reviewtydev.resource_api' }, 'ura.api_id', 'ra.id')
//           .andWhere('ura.status', '=', 'ACTIVE')
//           .andWhere('ur.status', '=', 'ACTIVE')
//           .andWhere('ra.name', '=', `${name}`)
//           .andWhere('ura.user_id', '=', user.id)
//           .count()
//           .clearOrder()
//           .first()
//           .then(row => +row.count),
//       );
//       if (error || count <= 0) {
//         throw new ForbiddenError(
//           `Bạn không có quyền truy cập vào tính năng này!`,
//         );
//       }
//       return next();
//     }
//   });
// }
