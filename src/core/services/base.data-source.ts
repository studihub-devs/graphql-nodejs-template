export interface BaseDataSource<Entity, Args> {
  getMany(args: Args): Promise<Entity[]>;

  getOne?(args: Args): Promise<Entity>;

  getCount(args: Args): Promise<number>;
}
