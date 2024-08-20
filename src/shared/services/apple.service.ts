import { injectable } from 'inversify';
import jwksClient from 'jwks-rsa';
import * as jwt from 'jsonwebtoken';
import { ApolloError } from 'apollo-server';

@injectable()
export class AppleService {
  async getApplePublicKey(kid: string): Promise<string> {
    return new Promise(resolve => {
      const client = jwksClient({
        jwksUri: 'https://appleid.apple.com/auth/keys',
      });
      client.getSigningKey(kid, (err, key) => {
        if (err) {
          resolve(null);
          return;
        }
        const signingKey = key.getPublicKey();
        resolve(signingKey);
      });
    });
  }

  async verifyJWT(
    token: string,
    publicKey: jwt.Secret | jwt.GetPublicKeyOrSecret,
  ): Promise<any> {
    return new Promise(resolve => {
      jwt.verify(token, publicKey, (err, payload) => {
        if (err) {
          return resolve(null);
        }
        return resolve(payload);
      });
    });
  }

  async me(
    accessToken: string,
  ): Promise<{
    id: string;
    email?: string;
  }> {
    const decoded = jwt.decode(accessToken, { complete: true });
    const header = decoded['header'];
    const kid = header.kid;
    const applePublicKey: string = await this.getApplePublicKey(kid);
    if (!applePublicKey) {
      return;
    }

    const payload = await this.verifyJWT(accessToken, applePublicKey);
    if (!payload) {
      throw new ApolloError('AccessToken invalid');
    }

    // console.log(payload, JSON.parse(process.env.APPLE_AUD_WHITE_LIST));
    if (
      JSON.parse(process.env.APPLE_AUD_WHITE_LIST).indexOf(payload.aud) > -1
    ) {
      return { id: payload.sub, email: payload.email };
    }

    throw new ApolloError('App Bundle invalid');
  }
}
