import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class PresignedUrl {
  @Field()
  key: string;

  @Field()
  url: string;
}
