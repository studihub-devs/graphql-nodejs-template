/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { GraphQLScalarType } from 'graphql';

export const Upload = new GraphQLScalarType({
  name: 'Upload',
  description: `The \`Upload scalar\` type represents a file upload.`,
  parseValue(value) {
    return value;
  },
  serialize() {
    throw new Error('`Upload` scalar serialization unsupported.');
  },
  parseLiteral() {
    throw new Error('`Upload` scalar literal unsuported.');
  },
});
