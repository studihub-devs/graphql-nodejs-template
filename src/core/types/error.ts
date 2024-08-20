// /* eslint-disable @typescript-eslint/ban-types */
// import { ClassType, Field, Int, ObjectType } from 'type-graphql';

import { Field, InterfaceType } from 'type-graphql';
import { ErrorStatus } from './error-status';

// // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
// export default function Error<TCode>(TCodeClass: ClassType<TCode>) {
//   @ObjectType({ isAbstract: true })
//   abstract class ErrorClass {
//     @Field(() => Int)
//     status: number;

//     @Field()
//     message: string;

//     @Field(() => TCodeClass)
//     code: TCode;
//   }
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   return ErrorClass as any;
// }
@InterfaceType()
export abstract class Error {
  @Field()
  message: string;

  @Field(() => ErrorStatus)
  status: ErrorStatus;
}
