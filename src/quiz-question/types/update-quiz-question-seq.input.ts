import { InputType, Field, Int } from 'type-graphql';

@InputType()
export class UpdateQuizQuestionSeqInput {
  @Field()
  questionId: number;  

  @Field(() => Int)
  seqId: number;  
}
