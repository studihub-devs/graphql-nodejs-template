'use strict';

import { container } from '../../inversify.config';
import { WinstonService } from '../services/winston.service';

/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable security/detect-object-injection */
/* eslint-disable no-async-promise-executor */
export interface HandleErrorOption {
  returnData: any;
  isThrown: boolean;
}

export function HandleError(option: HandleErrorOption): any {
  // eslint-disable-next-line prettier/prettier
  return function(
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    // eslint-disable-next-line prettier/prettier
    descriptor.value = async function(...args: any[]) {
      try {
        if (originalMethod.constructor.name == 'AsyncFunction') {
          return await originalMethod.apply(this, args);
        }
        return originalMethod.apply(this, args);
      } catch (error) {
        const winstonService = container.get(WinstonService);
        winstonService.logger.error(propertyKey, { error });

        if (option.isThrown) {
          throw error;
        }
        return option.returnData;
      }
    };
  };
}
