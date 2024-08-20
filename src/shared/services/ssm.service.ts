import { injectable } from 'inversify';
import { SSM } from '@aws-sdk/client-ssm';

@injectable()
export class SsmService {
  ssm: SSM;

  constructor() {
    this.ssm = new SSM({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      },
      signingRegion: process.env.AWS_REGION,
    });
  }
}
