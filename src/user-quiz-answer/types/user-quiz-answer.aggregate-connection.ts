import { ObjectType } from 'type-graphql';
import { UserQuizAnswerArgs } from './user-quiz-answer.args';

@ObjectType()
export class UserQuizAnswerConnectionAggregate {
  constructor(public readonly args: UserQuizAnswerArgs) {}
}
