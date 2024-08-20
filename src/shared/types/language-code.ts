import { registerEnumType } from 'type-graphql';

export enum LanguageCode {
  KO = 'KO',
  VI = 'VI',
  EN = 'EN',
}

registerEnumType(LanguageCode, {
  name: 'LanguageCode',
});
