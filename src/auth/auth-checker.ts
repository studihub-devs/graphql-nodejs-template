import { AuthChecker } from 'type-graphql';
import { Context } from '../core/types/context';

// create auth checker function
export const authChecker: AuthChecker<Context> = async (
  resolverData,
  roles,
) => {
  const {
    context: { user },
  } = resolverData;

  if (roles.length === 0) {
    // if `@Authorized()`, check only is user exist
    return user !== undefined;
  }
  // there are some roles defined now

  if (!user) {
    // and if no user, restrict access
    return false;
  }

  // no roles matched, restrict access
  return false;
};
