import { createParamDecorator } from 'type-graphql';
import { fieldsList } from '@bkstorm/graphql-fields-list';
import hash from 'object-hash';
import _ from 'lodash';

import { Context } from '../types/context';
import { container } from '../../inversify.config';

export function Loader(name: symbol): ParameterDecorator {
  return createParamDecorator<Context>(({ context, args, info }) => {
    const hashValue = `${String(name)}.${hash({
      fields: fieldsList(info),
      args,
    })}`;
    if (_.get(context, hashValue)) {
      return _.get(context, hashValue);
    }
    const loader = container.get(name);
    _.set(context, hashValue, loader);
    return loader;
  });
}
