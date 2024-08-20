import { registerEnumType } from 'type-graphql';
export enum CommonSuccessCode {
  SUCCESS = 'SUCCESS',
  CREATED = 'CREATED',
}

registerEnumType(CommonSuccessCode, {
  name: 'CommonSuccessCode',
  description: 'Common success codes',
});
