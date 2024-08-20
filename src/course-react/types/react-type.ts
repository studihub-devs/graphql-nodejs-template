import { registerEnumType } from 'type-graphql';

export enum ReactType {
  LIKE = 'like',
  BOOKMARK = 'bookmark',
}

registerEnumType(ReactType, {
  name: 'ReactType',
});
