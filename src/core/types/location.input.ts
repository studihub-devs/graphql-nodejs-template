import { Field, Float, InputType } from 'type-graphql';

@InputType()
export class LocationInput {
  @Field(() => Float, { description: 'Kinh độ' })
  longitude: number;

  @Field(() => Float, { description: 'Vĩ độ' })
  latitude: number;
}
