import { registerEnumType } from 'type-graphql';
export enum SuccessStatus {
  SUCCESS = 200,

  CREATED = 201,
}

registerEnumType(SuccessStatus, {
  name: 'SuccessStatus',
  description: 'Common successStatus status',
});
