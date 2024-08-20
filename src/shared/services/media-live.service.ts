import { MediaLive } from '@aws-sdk/client-medialive';
import { injectable } from 'inversify';

@injectable()
export class MediaLiveService {
  mediaLive: MediaLive;

  constructor() {
    this.mediaLive = new MediaLive({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      },
      signingRegion: process.env.AWS_REGION,
    });
  }
}
