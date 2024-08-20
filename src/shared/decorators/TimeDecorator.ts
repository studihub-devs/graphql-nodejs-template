'use strict';

/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable security/detect-object-injection */
/* eslint-disable no-async-promise-executor */
import { performance } from 'perf_hooks';

export function TimedDecorator(): any {
  // eslint-disable-next-line prettier/prettier
  return function(
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    // eslint-disable-next-line prettier/prettier
    descriptor.value = function(...args: any[]) {
      const start = performance.now();
      const result = originalMethod.apply(this, args);
      const finish = performance.now();
      console.log(
        `${propertyKey} took ${(finish - start).toFixed(2)} milliseconds`,
      );

      return result;
    };
  };
}
