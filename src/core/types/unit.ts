import { registerEnumType } from 'type-graphql';

export enum Unit {
  mcg = 'mcg',
  mg = 'mg',
  g = 'g',
  ml = 'ml',
  l = 'l',
  kcal = 'kcal',
  cal = 'cal',
  CFU = 'CFU',
  micronutrient = 'micronutrient',
}

registerEnumType(Unit, {
  name: 'Unit',
});
