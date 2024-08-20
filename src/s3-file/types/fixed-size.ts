import { registerEnumType } from 'type-graphql';

export enum FixedSize {
  SMALL = 240,
  MEDIUM = 600,
  LARGE = 1024,
}

registerEnumType(FixedSize, {
  name: 'FixedSize',
});
