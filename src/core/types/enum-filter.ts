import { GraphQLScalarType } from 'graphql';
import { Field, InputType, ClassType } from 'type-graphql';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function EnumFilter<Enum>(
  // eslint-disable-next-line @typescript-eslint/ban-types
  EnumClass: ClassType | GraphQLScalarType | Function | object | symbol,
) {
  @InputType()
  abstract class EnumFilterClass {
    @Field(() => EnumClass, { nullable: true })
    equals?: Enum;

    @Field(() => [EnumClass], { nullable: true })
    in?: Enum[];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return EnumFilterClass as any;
}
