import { InputType, Field, Int } from 'type-graphql';

@InputType()
export class UpdateCourseContentSeqInput {
  @Field()
  contentId: number;  

  @Field(() => Int)
  seqId: number;  
}
