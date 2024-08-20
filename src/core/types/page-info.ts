import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class PageInfo {
  constructor() {
    this.hasNextPage = false;
    this.hasPreviousPage = false;
  }

  @Field({ defaultValue: false })
  hasPreviousPage: boolean;

  @Field({ defaultValue: false })
  hasNextPage: boolean;

  @Field(() => ID, { nullable: true })
  startCursor?: string;

  @Field(() => ID, { nullable: true })
  endCursor?: string;
}
