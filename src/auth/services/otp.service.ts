import { injectable } from 'inversify';

import reader, { writer } from '../../knex';
import { WinstonService } from '../../shared/services/winston.service';
import { generateOTP } from '../../utils/generate-token';
import { dayjs } from '../../utils/dayjs';
import { EmailService } from '../../shared/services/email.service';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ErrorFactory } from '../../core/services/error-factory';
import knex from 'knex';

@injectable()
export class OtpService {
  constructor(
    private winstonService: WinstonService,
    private emailService: EmailService,
  ) {}

  async checkValidOTP(email: string, otp: number): Promise<boolean> {
    return reader
      .withSchema('reviewtydev')
      .from('otp')
      .where({
        email: email.toLowerCase(),
        otp,
      })
      .where('expired_at', '>', reader.raw('NOW()'))
      .count()
      .first()
      .then(row => +row.count > 0);
  }
  async checkVerifiedInfo(userId, type): Promise<boolean> {
    const result = await reader
      .withSchema('reviewtydev')
      .from('user')
      .where({
        id: userId,
      })
      .select('phone_verified', 'email_verified');

    const status =
      type === 'PHONE'
        ? result[0]['phone_verified']
        : result[0]['email_verified'];

    if (status != null) return status;

    return false;
  }

  async checkExistedInfo(value: string, type: string): Promise<boolean> {
    if (type == 'PHONE') {
      return reader
        .withSchema('reviewtydev')
        .from('user')
        .where({
          phone_number: value.toLowerCase(),
          phone_verified: true,
        })
        .count()
        .first()
        .then(row => +row.count > 0);
    }

    return reader
      .withSchema('reviewtydev')
      .from('user')
      .where({
        email: value.toLowerCase(),
        email_verified: true,
      })
      .count()
      .first()
      .then(row => +row.count > 0);
  }

  async checkValidUserOTP(
    userId: number,
    value: string,
    type: string,
    otp: number,
  ): Promise<boolean> {
    if (type == 'PHONE') {
      return await this.verifyUserPhone(userId, value, otp);
    } else {
      return await this.verifyUserEmail(userId, value, otp);
    }
  }
  async verifyUserPhone(userId, value, otp): Promise<boolean> {
    const result = await reader
      .withSchema('reviewtydev')
      .from('otp')
      .where({
        phone: value.toLowerCase(),
        otp,
      })
      .where('expired_at', '>', reader.raw('NOW()'))
      .count()
      .first()
      .then(row => +row.count > 0);

    if (result) {
      await writer
        .withSchema('reviewtydev')
        .from('user')
        .update({
          phone_number: value.toLowerCase(),
        })
        .where({
          id: userId,
        })
        .andWhereRaw('phone_number is null');

      await writer
        .withSchema('reviewtydev')
        .from('user')
        .update({
          phone_verified: true,
        })
        .where({
          id: userId,
          phone_number: value.toLowerCase(),
        });
      return true;
    }

    return false;
  }
  async verifyUserEmail(userId, value, otp): Promise<boolean> {
    const result = await reader
      .withSchema('reviewtydev')
      .from('otp')
      .where({
        email: value.toLowerCase(),
        otp,
      })
      .where('expired_at', '>', reader.raw('NOW()'))
      .count()
      .first()
      .then(row => +row.count > 0);

    if (result) {
      await writer
        .withSchema('reviewtydev')
        .from('user')
        .update({
          email_verified: true,
        })
        .where({
          id: userId,
          email: value.toLowerCase(),
        });
      return true;
    }

    return false;
  }

  async generateOTP(email: string): Promise<boolean> {
    const otp = generateOTP(6);
    try {
      await writer
        .withSchema('reviewtydev')
        .from('otp')
        .insert({
          email: email.toLowerCase(),
          otp,
          expired_at: dayjs()
            .add(+process.env.OTP_TIMEOUT, 'seconds')
            .toDate(),
        });
      await this.emailService.sendOTPEmail(email, otp);
      return true;
    } catch (error) {
      this.winstonService.logger.log('error', `OTP email of ${email} `, error);
      return false;
    }
  }

  async getAccessToken(): Promise<string> {
    const payload = {
      client_id: process.env.SMS_OTP_PROVIDER_CLIENT_ID,
      client_secret: process.env.SMS_OTP_PROVIDER_CLIENT_SECRET,
      scope: 'send_brandname_otp send_brandname',
      session_id: uuidv4(),
      grant_type: 'client_credentials',
    };

    const resp = await axios.post(
      process.env.SMS_OTP_PROVIDER_URL + '/oauth2/token',
      payload,
      {
        headers: {
          'Content-type': 'application/json',
        },
      },
    );

    const response = resp;
    // console.log(process.env.SMS_OTP_PROVIDER_URL)
    // console.log(resp);
    if ('access_token' in response.data) {
      return response.data['access_token'];
    }

    return '';
  }

  async sendSmsOtp(
    access_token: string,
    phone: string,
    otp: string,
  ): Promise<boolean> {
    const payload = {
      access_token: access_token,
      session_id: uuidv4(),
      BrandName: 'Reviewty',
      Phone: phone,
      Message: Buffer.from(
        `${otp} la ma xac thuc Reviewty cua ban. Vui long KHONG cung cap ma nay cho bat ky ai - Reviewty: My pham, Lam Dep`,
      ).toString('base64'),
      RequestId: uuidv4(),
    };
    const resp = await axios.post(
      process.env.SMS_OTP_PROVIDER_URL + '/api/push-brandname-otp',
      payload,
      {
        headers: {
          'Content-type': 'application/json',
        },
      },
    );

    if (resp.status == 200) {
      return true;
    }

    throw ErrorFactory.createForbiddenError('Provider connection error');
  }

  async generateSmsOTP(phone: string): Promise<boolean> {
    const otp = generateOTP(6);
    try {
      await writer
        .withSchema('reviewtydev')
        .from('otp')
        .insert({
          phone: phone.toLowerCase(),
          otp,
          expired_at: dayjs()
            .add(+process.env.OTP_TIMEOUT, 'seconds')
            .toDate(),
        });

      // Sending the Otp to the user's phone
      if (process.env.SMS_OTP_ON == 'ON') {
        const access_token = await this.getAccessToken();
        if (access_token != '') {
          await this.sendSmsOtp(access_token, phone.replace('+', ''), otp);
        } else {
          throw ErrorFactory.createForbiddenError('Provider connection error');
        }
      }
      return true;
    } catch (error) {
      this.winstonService.logger.log('error', `OTP phone of ${phone} `, error);
      return false;
    }
  }
}
