import { injectable } from 'inversify';
import { OrderBy } from '../types/order-by';

interface Options {
  orderBy: 'ASC' | 'DESC';
  nulls?: 'NULLS FIRST' | 'NULLS LAST';
}

@injectable()
export class OrderByService {
  convert2TypeOrmOrderByOptions(orderBy: OrderBy): Options {
    let options: Options;
    switch (orderBy) {
      case OrderBy.ASC:
        options = {
          orderBy: 'ASC',
        };
        break;
      case OrderBy.ASC_NULLS_FIRST:
        options = {
          orderBy: 'ASC',
          nulls: 'NULLS FIRST',
        };
        break;
      case OrderBy.ASC_NULLS_LAST:
        options = {
          orderBy: 'ASC',
          nulls: 'NULLS LAST',
        };
        break;
      case OrderBy.DESC:
        options = {
          orderBy: 'DESC',
        };
        break;
      case OrderBy.DESC_NULLS_FIRST:
        options = {
          orderBy: 'DESC',
          nulls: 'NULLS FIRST',
        };
        break;
      case OrderBy.DESC_NULLS_LAST:
        options = {
          orderBy: 'DESC',
          nulls: 'NULLS LAST',
        };
        break;
    }
    return options;
  }
}
