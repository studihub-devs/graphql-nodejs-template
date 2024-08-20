import { fieldsList, FieldNamesMap } from '@bkstorm/graphql-fields-list';
import { GraphQLResolveInfo } from 'graphql';
import { injectable } from 'inversify';
import hash from 'object-hash';
import { defaultMetadataStorage as classTransformerDefaultMetadataStorage } from 'class-transformer/cjs/storage';
import _ from 'lodash';

import { CacheService } from '../../shared/services/cache.service';
import { toObjectType } from '../../utils/to-object-type';

@injectable()
export class BaseService<E> {
  private _skipFields: Array<string> = ['__typename'];
  private _transformFields: FieldNamesMap;
  protected type: new (...args: never[]) => E;
  constructor(readonly cacheService: CacheService) {}

  getFieldList(
    info: GraphQLResolveInfo,
    options?: { prefix?: string; path?: string; nameType?: string },
  ): Array<string> {
    const prefix = options?.prefix ? `${options.prefix}.` : '';
    const fields = fieldsList(info, {
      path: options?.path,
      skip: options?.path
        ? this._skipFields.map(field => `${options.path}.${field}`)
        : this._skipFields,
      transform: this.transformFields,
      namedType: options?.nameType || this.type.name,
    });
    return _.uniq(fields.map(field => `${prefix}${field}`));
  }

  set skipFields(fields: string[]) {
    this._skipFields.push(...fields);
  }

  get skipFields(): Array<string> {
    return this._skipFields;
  }

  set transformFields(fields: FieldNamesMap) {
    this._transformFields = {
      ...classTransformerDefaultMetadataStorage
        .getExposedMetadatas(this.type)
        .reduce((acc, metadata) => {
          acc[metadata.propertyName] =
            metadata.options?.name || metadata.propertyName;
          return acc;
        }, {}),
      ...fields,
    };
  }

  get transformFields(): FieldNamesMap {
    return this._transformFields;
  }

  async getOrSetOne(
    id: number | string,
    fields: string[],
    invalidator: (fields: string[]) => E | Promise<E>,
  ): Promise<E> {
    const entity = await this.cacheService.getOrSetH(
      `${this.type.name}.${id}`,
      hash(fields),
      () => invalidator(fields),
    );
    if (!entity) {
      return null;
    }
    return toObjectType(this.type, entity);
  }

  async forceSetOne(
    id: number | string,
    fields: string[],
    invalidator: (fields: string[]) => E | Promise<E>,
  ): Promise<E> {
    const entity = await this.cacheService.forceSetH(
      `${this.type.name}.${id}`,
      hash(fields),
      () => invalidator(fields),
    );
    if (!entity) {
      return null;
    }
    return toObjectType(this.type, entity);
  }
}
