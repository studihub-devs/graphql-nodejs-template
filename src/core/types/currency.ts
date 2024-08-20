import { registerEnumType } from 'type-graphql';
export enum Currency {
  VND = 'VND',
}

registerEnumType(Currency, {
  name: 'Currency',
});
