import { injectable } from 'inversify';
import Hashids from 'hashids';

type NumberLike = number | bigint;

@injectable()
export class HashIdsService {
  private readonly hashids: Hashids;
  constructor() {
    this.hashids = new Hashids(process.env.HASH_ID_SALT, 10);
  }

  encode(id: NumberLike): string {
    return this.hashids.encode(id);
  }

  decode(id: string): NumberLike {
    return this.hashids.decode(id)[0];
  }
}
