import { registerEnumType } from 'type-graphql';

export enum OtpType {
  PHONE = 'PHONE',
  EMAIL = 'EMAIL',
  OTHER = 'OTHER',
}

registerEnumType(OtpType, {
  name: 'OtpType',
});
