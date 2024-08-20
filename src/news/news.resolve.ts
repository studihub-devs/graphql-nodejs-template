import { GraphQLResolveInfo } from 'graphql';
import { injectable } from 'inversify';
import {
  Arg,
  Args,
  Ctx,
  FieldResolver,
  Info,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { LOADER_TYPES } from '../core/dataloader/loader-types';
import { Loader } from '../core/decorators/loader.decorator';
import { Context } from '../core/types/context';
import { User } from '../user/entities/user.entity';
import { UserLoader } from '../user/services/user-by-id.loader';
import { UserService } from './../user/services/user.service';
import { News } from './entities/news.entity';
import { NewsService } from './services/news.service';
import { NewsWhereInput } from './types/news-where.input';
import { NewsArgs } from './types/news.args';
import { NewsConnection } from './types/news.connection';
import { NewsRelayConnection } from './types/news.relay-connection';

@injectable()
@Resolver(() => News)
export class NewsResolver {
  constructor(
    private newsService: NewsService,
    private userService: UserService,
  ) {}

  @Query(() => NewsConnection)
  newsConnection(@Args() args: NewsArgs): NewsConnection {
    return new NewsConnection(args);
  }

  @FieldResolver(() => User, { nullable: true })
  async user(
    @Root() news: News,
    @Info() info: GraphQLResolveInfo,
    @Loader(LOADER_TYPES.UserLoader) userLoader: UserLoader,
  ): Promise<User> {
    if (!news?.createdBy) {
      return null;
    }
    return userLoader.load({
      id: news.createdBy,
      fields: this.userService.getFieldList(info),
    });
  }

  @Query(() => [News])
  async news(
    @Args() args: NewsArgs,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<News[]> {
    return this.newsService.getMany(args, info, ctx);
  }

  @Query(() => News)
  async newsById(
    @Arg('where') where: NewsWhereInput,
    @Info() info: GraphQLResolveInfo,
  ): Promise<News> {
    return this.newsService.getOne(where, info);
  }

  @Query(() => NewsRelayConnection)
  async newsRelay(
    @Args() args: NewsArgs,
    @Info() info: GraphQLResolveInfo,
    @Ctx() ctx: Context,
  ): Promise<NewsRelayConnection> {
    return this.newsService.getManyRelayFormat(args, info, ctx);
  }
}
