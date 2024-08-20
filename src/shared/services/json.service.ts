import { injectable } from 'inversify';

@injectable()
export class JsonService {
  dateKeys: Set<string>;

  constructor() {
    this.dateKeys = new Set([
      'createdAt',
      'created_at',
      'updatedAt',
      'updated_at',
      'startedAt',
      'endedAt',
      'reviewDeadline',
      'commentedAt',
      'savedDateByViewer',
    ]);
  }

  parse<T>(value: string): T {
    return JSON.parse(value, (key: string, value: any) => {
      if (this.dateKeys.has(key)) {
        return new Date(value);
      }
      return value;
    });
  }
}
