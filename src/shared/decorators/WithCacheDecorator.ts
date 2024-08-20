'use strict';

/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable security/detect-object-injection */
/* eslint-disable no-async-promise-executor */
import dayjs from 'dayjs';
import { container } from '../../inversify.config';
import { CacheService } from '../services/cache.service';
import crypto from 'crypto';
import stringify from 'json-stable-stringify';

export type CacheOption = {
  path: string;
  expiredTime: number;
  autoKey: boolean;
};

function generateKey(...args: any[]) {
  return crypto
    .createHash('md5')
    .update(stringify(args))
    .digest('hex');
}

export function WithCache(option: CacheOption): any {
  // eslint-disable-next-line prettier/prettier
  return function(
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    // eslint-disable-next-line prettier/prettier
    descriptor.value = function(...args: any[]) {
      const cacheService = container?.get(CacheService);
      const resultPromise = cacheService.getOrSet(
        `${option.path}.${generateKey(args)}`,
        () => originalMethod.apply(this, args),
        dayjs.duration(60 * option.expiredTime, 'seconds'),
      );

      return resultPromise;
    };
  };
}
