export interface Dao<T> {
  getOne(...args: unknown[]): Promise<T | null>;

  getMany(...args: unknown[]): Promise<T[]>;

  getCount(...args: unknown[]): Promise<number>;

  create(...args: unknown[]): T | Promise<T>;

  update(...args: unknown[]): T | Promise<T>;

  delete(...args: unknown[]): T | Promise<T>;
}
