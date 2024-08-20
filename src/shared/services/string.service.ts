import { injectable } from 'inversify';

@injectable()
export class StringService {
  convertSnake2Camel(source: string): string {
    return source.replace(/([-_][a-z])/g, group =>
      group
        .toUpperCase()
        .replace('-', '')
        .replace('_', ''),
    );
  }
}
