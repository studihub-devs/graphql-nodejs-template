import { registerEnumType } from 'type-graphql';

export enum AggregationOperator {
  COUNT = 0,
  AVG = 1,
  SUM = 2,
}

registerEnumType(AggregationOperator, {
  name: 'AggregationOperator',
});
