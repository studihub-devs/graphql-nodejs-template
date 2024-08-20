import { registerEnumType } from 'type-graphql';

export enum PeriodType {
  HOUR = 'HOUR',
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  QUARTER = 'QUARTER',
}

registerEnumType(PeriodType, {
  name: 'PeriodType',
});
