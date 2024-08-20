/* eslint-disable @typescript-eslint/no-unused-vars */
import { ValidationArguments } from 'class-validator';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const checkLengthInput = ({
  constraints,
  property,
  ...validationArguments
}: ValidationArguments): string =>
  `${property} cần nhỏ hơn hoặc bằng ${constraints[1]}`;

export const checkArrayMinSize = ({
  constraints,
  property,
  ...validationArguments
}: ValidationArguments): string =>
  `Số lượng phần tử gửi lên phải lớn hơn ${constraints[1]}`;

// export const checkTypeInput = ({
//   constraints,
//   property,
//   ...validationArguments
// }: ValidationArguments): string =>
//   `${property} cần nhỏ hơn hoặc bằng ${constraints[1]}`;
