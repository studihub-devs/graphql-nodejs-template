import { registerEnumType } from 'type-graphql';

export enum EmailErrorCode {
  EMAIL_ADDRESS_ALREADY_BEING_USED = 'EMAIL_ADDRESS_ALREADY_BEING_USED',
}

registerEnumType(EmailErrorCode, {
  name: 'EmailErrorCode',
});
