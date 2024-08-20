import { injectable } from 'inversify';
import { CloudFront } from '@aws-sdk/client-cloudfront';

@injectable()
export class CloudFrontService {
  readonly cloudFront: CloudFront;

  constructor() {
    this.cloudFront = new CloudFront({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      },
    });
  }
}
