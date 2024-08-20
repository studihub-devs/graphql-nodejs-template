import { injectable } from 'inversify';
import Email from 'email-templates';
import { Queue, Worker } from 'bullmq';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

import { WinstonService } from './winston.service';

@injectable()
export class EmailService {
  private email: Email;

  private emailQueue: Queue;
  private worker: Worker;
  private sesClient: SESClient;

  constructor(private winstonService: WinstonService) {
    this.sesClient = new SESClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      },
      signingRegion: process.env.AWS_REGION,
    });
  }

  async sendForgetPasswordEmail(to: string, password: string): Promise<void> {
    this.sesClient
      .send(
        new SendEmailCommand({
          Destination: {
            ToAddresses: [to],
          },
          Message: {
            Subject: {
              Charset: 'UTF-8',
              Data: '[Studihub] - Mật khẩu của bạn đã được cấp lại',
            },
            Body: {
              Html: {
                Charset: 'UTF-8',
                Data: `
              <!DOCTYPE html>
              <html lang="en">
                <body>
                  Mật khẩu mới của tài khoản ${to} là:
                  <br />
                  <h1>${password}</h1>
                </body>
              </html>              
              `,
              },
            },
          },
          Source: process.env.EMAIL_NO_REPLY_USER,
        }),
      )
      .catch(reason => {
        this.winstonService.logger.log('error', 'Fail to send an email', {
          error: reason,
        });
      });
  }

  async sendBlockedShopEmail(email: string, reason?: string): Promise<void> {
    this.sesClient
      .send(
        new SendEmailCommand({
          Destination: {
            ToAddresses: [email],
          },
          Message: {
            Subject: {
              Charset: 'UTF-8',
              Data: '[Reviewty] - Shop của bạn đã bị khoá',
            },
            Body: {
              Html: {
                Charset: 'UTF-8',
                Data: `
              <!DOCTYPE html>
              <html lang="en">
                <body>
                  Shop của bạn đã bị khoá vì lí do sau đây, hãy nhanh tay cập nhật lại
                  thông tin nhé:
                  <br />
                  ${reason}
                </body>
              </html>              
              `,
              },
            },
          },
          Source: process.env.EMAIL_NO_REPLY_USER,
        }),
      )
      .catch(reason => {
        this.winstonService.logger.log('error', 'Fail to send an email', {
          error: reason,
        });
      });
  }

  async sendUnBlockedShopEmail(email: string, reason?: string): Promise<void> {
    this.sesClient
      .send(
        new SendEmailCommand({
          Destination: {
            ToAddresses: [email],
          },
          Message: {
            Subject: {
              Charset: 'UTF-8',
              Data: '[Reviewty] - Shop của bạn đã được mở khoá',
            },
            Body: {
              Html: {
                Charset: 'UTF-8',
                Data: `
              <!DOCTYPE html>
              <html lang="en">
                <body>
                  Shop của bạn đã được mở khoá, hãy nhanh tay cập nhật lại
                  thông tin nhé.
                  <br />
                  ${reason}
                </body>
              </html>              
              `,
              },
            },
          },
          Source: process.env.EMAIL_NO_REPLY_USER,
        }),
      )
      .catch(reason => {
        this.winstonService.logger.log('error', 'Fail to send an email', {
          error: reason,
        });
      });
  }

  async sendOTPEmail(to: string, otp: string): Promise<void> {
    this.sesClient
      .send(
        new SendEmailCommand({
          Destination: {
            ToAddresses: [to],
          },
          Message: {
            Subject: {
              Charset: 'UTF-8',
              Data: '[Studihub] - Mã xác thực email',
            },
            Body: {
              Html: {
                Charset: 'UTF-8',
                Data: `
              <!DOCTYPE html>
              <html lang="en">
                <body>
                  Mã OTP có hiệu lực trong vòng ${+process.env.OTP_TIMEOUT /
                    60} phút, vui lòng không chia sẻ
                  mã OTP này với bất kì ai:
                  <h1>${otp}</h1>
                  hoặc click vào link sau: <a href="${
                    process.env.EMAIL_OTP_LINK
                  }/${otp}">link</a>
                </body>
              </html>
              `,
              },
            },
          },
          Source: process.env.EMAIL_NO_REPLY_USER,
        }),
      )
      .catch(reason => {
        this.winstonService.logger.log('error', 'Fail to send an email', {
          error: reason,
        });
      });
  }

  async sendRegisterProductForms(to: string): Promise<void> {
    const content = `
    <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, Helvetica, sans-serif">
          <h1 style="font-size: 22px;" >ĐĂNG KÝ/CẬP NHẬT THÔNG TIN SẢN PHẨM</h1>
          <p>Kính gửi Qúy Nhãn Hàng,</p>
          <p>
            Reviewty chân thành cảm ơn sự quan tâm của Quý Nhãn hàng tới Nền tảng của
            chúng tôi.
          </p>
          <p>
            Để hoàn tất quy trình đăng ký/cập nhật thông tin sản phẩm trên app
            Reviewty, Quý Nhãn hàng vui lòng tải form <a href='https://d1ip8wajnedch4.cloudfront.net/web/Product_Registration_BRAND_220404.xlsx'>tại đây</a>, điền
            thông tin theo như nội dung trong file đã có mẫu (2 sheet) và gửi lại cho
            Reviewty theo mail này.
          </p>
          <p>
            Mọi thông tin và thắc mắc, Quý Nhãn hàng cũng có thể trao đổi lại thông
            qua mail này để Reviewty có thể giải đáp kịp thời!
          </p>
          <p>Reviewty mong sớm nhận được phản hồi của Quý Nhãn hàng!</p>
        </body>
      </html>
    `;

    this.sesClient
      .send(
        new SendEmailCommand({
          Destination: {
            ToAddresses: [to],
          },
          Message: {
            Subject: {
              Charset: 'UTF-8',
              Data: '[REVIEWTY] ĐĂNG KÝ/CẬP NHẬT THÔNG TIN SẢN PHẨM',
            },
            Body: {
              Html: {
                Charset: 'UTF-8',
                Data: content,
              },
            },
          },
          Source: process.env.MARKETING_EMAIL_ADDRESS,
        }),
      )
      .catch(reason => {
        this.winstonService.logger.log('error', 'Fail to send an email', {
          error: reason,
        });
      });
  }
}
