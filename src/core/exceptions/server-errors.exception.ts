import { ApolloError } from 'apollo-server';

export class ServerErrorsException extends ApolloError {
  constructor(message?: string, code = 'SERVER_ERROR') {
    super(message, code);
  }
}
