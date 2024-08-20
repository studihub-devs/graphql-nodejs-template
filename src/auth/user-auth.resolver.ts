import { Resolver, Mutation, Arg, Ctx, Authorized, Query } from 'type-graphql';
import { injectable } from 'inversify';
import { UserAuthService } from './services/user-auth.service';
import { AuthPayloadOrError } from './types/auth-payload-or-error';
import { Context } from '../core/types/context';
import { CreateUserInput } from './types/create-user.input';
import { User } from '../user/entities/user.entity';

@injectable()
@Resolver()
export class UserAuthResolver {
  constructor(private authService: UserAuthService) {}

  @Mutation(() => AuthPayloadOrError)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
  ): Promise<typeof AuthPayloadOrError> {
    return this.authService.login(email, password);
  }

  @Authorized()
  @Query(() => User)
  async me(@Ctx() ctx: Context): Promise<User> {
    return ctx.user;
  }

  @Mutation(() => AuthPayloadOrError)
  async signUp(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() ctx: Context,
  ): Promise<typeof AuthPayloadOrError> {
    return this.authService.signUp(email, password, ctx);
  }

  @Authorized()
  @Mutation(() => AuthPayloadOrError)
  async createUser(
    @Arg('data') data: CreateUserInput,
    @Ctx() ctx: Context,
  ): Promise<typeof AuthPayloadOrError> {
    return this.authService.create(data, ctx);
  }

  @Mutation(() => Boolean)
  async forgetPassword(@Arg('email') email: string): Promise<boolean> {
    return this.authService.forgetPassword(email);
  }

  @Authorized()
  @Mutation(() => AuthPayloadOrError)
  async changePassword(
    @Arg('currentPassword') currentPassword: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() ctx: Context,
  ): Promise<typeof AuthPayloadOrError> {
    return this.authService.changePassword(currentPassword, newPassword, ctx);
  }

  // @Authorized()
  // @Mutation(() => EmailOrError)
  // async changeEmail(
  //   @Arg('email') email: string,
  //   @CurrentUser() user: User,
  // ): Promise<typeof EmailOrError> {
  //   return this.authService.changeEmail(email, user.id);
  // }

  // @Authorized()
  // @Mutation(() => Boolean)
  // async changePhone(
  //   @Arg('phone') phone: string,
  //   @CurrentUser() user: User,
  // ): Promise<boolean> {
  //   return this.authService.changePhone(phone, user.id);
  // }

  // @Mutation(() => AuthPayloadOrError)
  // async confirmEmail(
  //   @Arg('otp', () => Int) otp: number,
  //   @CurrentUser() user: User,
  // ): Promise<typeof AuthPayloadOrError> {
  //   return this.authService.confirmEmail(otp, user);
  // }

  // @Mutation(() => Boolean)
  // async generateOTP(@Arg('email') email: string): Promise<boolean> {
  //   return this.otpService.generateOTP(email);
  // }

  // @Mutation(() => Boolean)
  // async generateSmsOTP(@Arg('phone') phone: string): Promise<boolean> {
  //   return this.otpService.generateSmsOTP(phone);
  // }

  // @Authorized()
  // @Mutation(() => Boolean)
  // async logout(
  //   @Arg('token', { nullable: true }) token: string,
  //   @Ctx() ctx: Context,
  // ): Promise<boolean> {
  //   return this.authService.logout(ctx, token);
  // }
}
