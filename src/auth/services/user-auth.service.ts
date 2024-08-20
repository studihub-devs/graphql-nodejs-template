import { injectable } from 'inversify';
import { hash, compare } from 'bcryptjs';
import { generate } from 'generate-password';
import _ from 'lodash';
import { plainToClass } from 'class-transformer';
import knex, { writer } from '../../knex';
import { UserAuthPayload } from '../types/user-auth-payload';
import { JwtService } from './jwt.service';
import { AuthPayloadOrError } from '../types/auth-payload-or-error';
import { AuthError } from '../types/auth-error';
import { AuthErrorCode } from '../types/auth-error-code';
import { Context } from '../../core/types/context';
import { ErrorStatus } from '../../core/types/error-status';
import { User } from '../../user/entities/user.entity';
import to from 'await-to-js';
import { CreateUserInput } from '../types/create-user.input';
import { EmailService } from '../../shared/services/email.service';

@injectable()
export class UserAuthService {
  constructor(
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<typeof AuthPayloadOrError> {
    const where = {
      email: email.toLowerCase(),
      isActive: true,
    };
    const user = await knex
      .from('studihub.user')
      .select('*')
      .where({ email: email.toLocaleLowerCase() })
      .first()
      .then(row => row);

    if (!user) {
      return new AuthError({
        code: AuthErrorCode.UNAUTHORIZED,
        status: ErrorStatus.UNAUTHORIZED,
      });
    }

    const valid = await compare(password, user ? user.password : '');

    if (!valid) {
      return new AuthError({
        code: AuthErrorCode.UNAUTHORIZED,
        status: ErrorStatus.UNAUTHORIZED,
      });
    }

    return plainToClass(
      UserAuthPayload,
      {
        user,
        token: this.jwtService.generateMobileToken(user['id'], user['role_id']),
      },
      {
        ignoreDecorators: true,
      },
    );
  }

  async create(
    data: CreateUserInput,
    ctx: Context,
  ): Promise<typeof AuthPayloadOrError> {
    return writer.transaction(async trx => {
      const [error, user] = await to(
        trx
          .from('studihub.user')
          .insert({
            email: data.email,
            password: data.password && (await hash(data.password, 10)),
            name: data.name,
            gender: data.gender,
            role_id: data.roleId,
            wallet_id: data.walletId,
            created_by: ctx.user?.id,
            is_active: true,
            created_at: new Date(),
          })
          .returning('*')
          .then(rows => plainToClass(User, rows[0])),
      );
      if (error) {
        return new AuthError({
          message: 'email already in use',
          code: AuthErrorCode.EMAIL_ALREADY_IN_USE,
          status: ErrorStatus.FORBIDDEN,
        });
      }
      return plainToClass(
        UserAuthPayload,
        {
          user,
          token: this.jwtService.generateMobileToken(user.id, user.roleId),
        },
        {
          ignoreDecorators: true,
        },
      );
    });
  }

  async signUp(
    email: string,
    password: string,
    ctx: Context,
  ): Promise<typeof AuthPayloadOrError> {
    return writer.transaction(async trx => {
      const [error, user] = await to(
        trx
          .from('studihub.user')
          .insert({
            email: email,
            password: password && (await hash(password, 10)),
            role_id: 1,
            is_active: true,
            created_at: new Date(),
          })
          .returning('*')
          .then(rows => plainToClass(User, rows[0])),
      );

      if (error) {
        return new AuthError({
          code: AuthErrorCode.EMAIL_ALREADY_IN_USE,
          status: ErrorStatus.FORBIDDEN,
        });
      }
      return plainToClass(
        UserAuthPayload,
        {
          user,
          token: this.jwtService.generateMobileToken(user.id, user.roleId),
        },
        {
          ignoreDecorators: true,
        },
      );
    });
  }

  async forgetPassword(email: string): Promise<boolean> {
    const plainPass = generate({ length: 8, numbers: true });
    const affedtedRows = await writer
      .from('studihub.user')
      .update({
        password: await hash(plainPass, 10),
      })
      .where('email', '=', email.toLowerCase());

    if (affedtedRows !== 0) {
      this.emailService.sendForgetPasswordEmail(email.toLowerCase(), plainPass);
      return true;
    } else {
      throw new Error('Email does not exist');
    }
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
    ctx: Context,
  ): Promise<typeof AuthPayloadOrError> {
    const { password } = await knex
      .from('studihub.user')
      .select('password')
      .where('id', '=', ctx.user?.id)
      .first();
    const valid: boolean = await compare(currentPassword, password);
    if (!valid) {
      throw new AuthError({
        message: 'Old password is not match!',
        code: AuthErrorCode.UNAUTHORIZED,
        status: ErrorStatus.FORBIDDEN,
      });
    }

    const [error] = await to(
      writer
        .from('studihub.user')
        .update({
          password: await hash(newPassword, 10),
        })
        .where('id', '=', ctx.user?.id),
    );
    if (error) {
      throw error;
    }

    return {
      user: ctx.user,
      token: this.jwtService.generateMobileToken(
        ctx.user?.id,
        ctx.user?.roleId,
      ),
    };
  }

  // async changeEmail(
  //   email: string,
  //   userId: number,
  // ): Promise<typeof EmailOrError> {
  //   await this.cacheService.redis.del(`${User.name}.${userId}`);
  //   return writer
  //     .transaction(async trx => {
  //       await trx
  //         .from('reviewtydev.user')
  //         .update({
  //           email: email.toLowerCase(),
  //           email_verified: false,
  //         })
  //         .where('id', '=', userId);
  //       await this.otpService.generateOTP(email);
  //     })
  //     .then(() =>
  //       plainToClass(EmailPayload, {
  //         email,
  //       }),
  //     )
  //     .catch(reason => {
  //       this.winstonService.logger.log(
  //         'error',
  //         `Change email of ${userId} `,
  //         reason,
  //       );
  //       if (reason.code === PostgreErrorCode.UNIQUE_VIOLATION) {
  //         return new EmailError({
  //           status: ErrorStatus.FORBIDDEN,
  //           code: EmailErrorCode.EMAIL_ADDRESS_ALREADY_BEING_USED,
  //           message: 'This email address is already being used',
  //         });
  //       }
  //       return ErrorFactory.createInternalServerError();
  //     });
  // }

  // async changePhone(phone: string, userId: number): Promise<boolean> {
  //   await writer
  //     .transaction(async trx => {
  //       await trx
  //         .from('reviewtydev.user')
  //         .update({
  //           phone_number: phone.toLowerCase(),
  //           phone_verified: false,
  //         })
  //         .where('id', '=', userId);

  //       await this.otpService.generateSmsOTP(phone);
  //     })
  //     .then(() => true)
  //     .catch(reason => {
  //       this.winstonService.logger.log(
  //         'error',
  //         `Change phone of ${userId} `,
  //         reason,
  //       );
  //       return false;
  //     });

  //   return true;
  // }

  // async confirmEmail(
  //   otp: number,
  //   user: User,
  // ): Promise<typeof AuthPayloadOrError> {
  //   const valid = await this.otpService.checkValidOTP(user.email, otp);
  //   if (!valid) {
  //     return new AuthError({
  //       code: AuthErrorCode.OTP_NOT_VALID,
  //       status: ErrorStatus.BAD_REQUEST,
  //       message: 'OTP is invalid',
  //     });
  //   }
  //   try {
  //     await writer
  //       .from('reviewtydev.user')
  //       .update({ email_verified: true })
  //       .where('id', '=', user.id);
  //     return plainToClass(UserAuthPayload, {
  //       user,
  //       token: this.jwtService.generateMobileToken(user.id, user.roleId),
  //     });
  //   } catch (reason) {
  //     this.winstonService.logger.log(
  //       'error',
  //       `Confirm email of ${user.id} `,
  //       reason,
  //     );
  //     return ErrorFactory.createInternalServerError();
  //   }
  // }

  // async logout(ctx: Context, token?: string): Promise<boolean> {
  //   if (!token) {
  //     return;
  //   }
  //   const [error] = await to(
  //     writer
  //       .from('reviewtydev.device')
  //       .where(_.omitBy({ user_id: ctx?.user?.id, token }, _.isUndefined))
  //       .del(),
  //   );
  //   if (error) {
  //     return false;
  //   }
  //   return true;
  // }
}
