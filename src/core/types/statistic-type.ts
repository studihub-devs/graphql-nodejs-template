import { registerEnumType } from 'type-graphql';

export enum StatisticType {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  QUARTER = 'QUARTER',
}

registerEnumType(StatisticType, {
  name: 'StatisticType',
});
