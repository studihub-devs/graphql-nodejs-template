import { InputType, Field, Int } from 'type-graphql';

@InputType()
export class UpsertQuizAnswerInput {
  @Field(() => Int, { nullable: true })
  id?: number;
  
  @Field({ nullable: true })
  content?: string; 

  @Field(() => Int, { nullable: true })  
  seqId?: number;

  @Field(() => Boolean, { nullable: true })
  isCorrect?: boolean; 
}
