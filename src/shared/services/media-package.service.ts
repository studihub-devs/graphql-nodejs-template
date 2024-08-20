import { MediaPackage } from '@aws-sdk/client-mediapackage';
import { injectable } from 'inversify';

@injectable()
export class MediaPackageService {
  readonly mediaPackage: MediaPackage;

  constructor() {
    this.mediaPackage = new MediaPackage({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      },
      signingRegion: process.env.AWS_REGION,
    });
  }
}
