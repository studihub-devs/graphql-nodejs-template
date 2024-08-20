import { InputType, Field, Int, Float } from 'type-graphql';
import { QuizStatus } from './quiz-status';


@InputType()
export class UpdateQuizInput {
  @Field(() => QuizStatus, { nullable: true })
  status?: QuizStatus;

  @Field({ nullable: true })
  name?: string; 

  @Field(() => Int, { nullable: true })
  duration?: number;  

  @Field(() => Date, { nullable: true })  
  fromTime?: Date;

  @Field(() => Date, { nullable: true })
  toTime?: Date; 
}
