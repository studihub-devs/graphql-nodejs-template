import { injectable } from 'inversify';
import jwt from 'jsonwebtoken';
@injectable()
export class JwtService {
  generateMobileToken(
    id: number,
    role_id: number,
    options: jwt.SignOptions = { subject: `${id}` },
  ): string {
    return jwt.sign(
      { subject: `${id}`, role_id: `${role_id}` },
      process.env.JWT_SECRET_MOBILE,
      options,
    );
  }

  generateAdminToken(
    id: number,
    role_id: number,
    options: jwt.SignOptions = { subject: `${id}`, expiresIn: '7 days' },
  ): string {
    return jwt.sign(
      { subject: `${id}`, role_id: `${role_id}` },
      process.env.JWT_SECRET_ADMIN,
      options,
    );
  }

  decodeMobileToken(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET_MOBILE);
  }

  decodeAdminToken(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET_ADMIN);
  }
}
