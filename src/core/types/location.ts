import { Field, Float, ObjectType } from 'type-graphql';

@ObjectType()
export class Location {
  @Field(() => Float, { description: 'Kinh độ' })
  longitude: number;

  @Field(() => Float, { description: 'Vĩ độ' })
  latitude: number;
}
