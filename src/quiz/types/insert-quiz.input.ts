import { InputType, Field, Int } from 'type-graphql';

@InputType()
export class InsertQuizInput {
  @Field()
  name: string;

  @Field(() => Int)  
  courseContentId: number;

  @Field(() => Int, { nullable: true })
  duration: number;  

  @Field(() => Date, { nullable: true })  
  fromTime?: Date;

  @Field(() => Date, { nullable: true })
  toTime?: Date;  
}
