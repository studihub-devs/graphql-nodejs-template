import { injectable } from 'inversify';

import { toObjectType } from '../../utils/to-object-type';
import { CommonError } from '../types/common-error';
import { CommonErrorCode } from '../types/common-error-code';
import { ErrorStatus } from '../types/error-status';

@injectable()
export class ErrorFactory {
  static createInternalServerError(): CommonError {
    const error = new CommonError();
    error.status = ErrorStatus.INTERNAL_SERVER_ERROR;
    error.message = 'Internal server error';
    error.code = CommonErrorCode.INTERNAL_SERVER_ERROR;
    return error;
  }

  static createForbiddenError(message?: string): CommonError {
    const error = new CommonError();
    error.status = ErrorStatus.FORBIDDEN;
    error.message = message || 'You do not have permissions to access';
    error.code = CommonErrorCode.FORBIDDEN;
    return error;
  }

  static createNotFoundError(message?: string): CommonError {
    return toObjectType(CommonError, {
      status: ErrorStatus.NOT_FOUND,
      message: message || 'Not found',
      code: CommonErrorCode.NOT_FOUND,
    });
  }

  // New method to create user input error
  static createUserInputError(message: string): CommonError {
    const error = new CommonError();
    error.status = ErrorStatus.BAD_REQUEST;
    error.message = message;
    error.code = CommonErrorCode.USER_INPUT_ERROR;
    return error;
  }
}
