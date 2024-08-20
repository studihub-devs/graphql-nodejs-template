import { Field, Int, ObjectType } from 'type-graphql';
import { Expose, Type } from 'class-transformer';

@ObjectType()
export class QuizAnswer {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  content: string;

  @Field(() => Int, { nullable: true })
  @Expose({ name: 'question_id' })
  questionId: number;

  @Field(() => Int, { nullable: true })
  @Expose({ name: 'seq_id' })
  seqId: number;

  @Field(() => Boolean, { nullable: true })
  @Expose({ name: 'is_correct' })
  isCorrect: boolean;

  @Field()
  @Expose({ name: 'created_at' })
  @Type(() => Date)
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  @Expose({ name: 'updated_at' })
  @Type(() => Date)
  updatedAt?: Date;
}
