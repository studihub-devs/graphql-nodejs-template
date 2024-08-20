export interface SelectLoaderKey<T = string | number> {
  id: T;
  fields: string[];
  data?: any;
}
