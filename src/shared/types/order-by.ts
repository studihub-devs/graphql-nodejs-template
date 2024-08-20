import { registerEnumType } from 'type-graphql';

export enum OrderBy {
  ASC = 'ASC',
  ASC_NULLS_FIRST = 'ASC NULLS FIRST',
  ASC_NULLS_LAST = 'ASC NULLS LAST',
  DESC = 'DESC',
  DESC_NULLS_FIRST = 'DESC NULLS FIRST',
  DESC_NULLS_LAST = 'DESC NULLS LAST',
}

registerEnumType(OrderBy, {
  name: 'OrderBy',
});
