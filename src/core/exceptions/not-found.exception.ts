import { ApolloError } from 'apollo-server';

export class NotFoundException extends ApolloError {
  constructor(message?: string, code = 'NOT_FOUND') {
    super(message, code);
  }
}
