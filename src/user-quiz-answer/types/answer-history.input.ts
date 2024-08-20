import { Field, Float, InputType, Int } from 'type-graphql';
import { Expose, Type } from 'class-transformer';

@InputType()
export class AnswerHistory { 
  @Field(() => Int)  
  questionId: number;

  @Field(() => [Int], { nullable: true })  
  answers: number[];

  @Field(() => Boolean, { nullable: true })
  isCorrect: boolean; 

  @Field(() => Float, { nullable: true })
  score: number; 
}
