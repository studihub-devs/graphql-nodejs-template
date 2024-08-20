import { injectable } from 'inversify';

import { toObjectType } from '../../utils/to-object-type';
import { CommonSuccess } from '../types/common-success';
import { CommonSuccessCode } from '../types/common-success-code';
import { SuccessStatus } from '../types/success-status';

@injectable()
export class SuccessFactory {
  static successFactory(message?: string): CommonSuccess {
    return toObjectType(CommonSuccess, {
      status: SuccessStatus.SUCCESS,
      message: message || '',
      code: CommonSuccessCode.SUCCESS,
    });
  }
}
