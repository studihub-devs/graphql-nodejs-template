import { ObjectType } from 'type-graphql';
import { UserQuizArgs } from './user-quiz.args';

@ObjectType()
export class UserQuizConnectionAggregate {
  constructor(public readonly args: UserQuizArgs) {}
}
