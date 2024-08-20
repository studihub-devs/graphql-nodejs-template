import { ApolloError } from 'apollo-server';

export class ForbiddenException extends ApolloError {
  constructor(message?: string, code = 'FORBIDDEN') {
    super(message, code);
  }
}
