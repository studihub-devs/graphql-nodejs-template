import { injectable } from 'inversify';
import { FieldResolver, Resolver, Int, Root } from 'type-graphql';
import { RoleService } from './services/role.service';
import { RolesConnectionAggregate } from './types/roles.aggregate-connection';

@injectable()
@Resolver(() => RolesConnectionAggregate)
export class RoleAggreateResolver {
  constructor(private roleService: RoleService) {}

  // TODO use loader (like reviews-aggregate-resolver) if neccessary
  @FieldResolver(() => Int)
  async count(@Root() aggregate: RolesConnectionAggregate): Promise<number> {
    return this.roleService.getCount(aggregate.args);
  }
}
