import { IvsClient } from '@aws-sdk/client-ivs';
import { injectable } from 'inversify';

@injectable()
export class IvsClientService {
  ivsClient: IvsClient;

  constructor() {
    this.ivsClient = new IvsClient({
      region: process.env.IVS_REGION,
      credentials: {
        accessKeyId: process.env.IVS_ACCESS_KEY_ID,
        secretAccessKey: process.env.IVS_SECRET_ACCESS_KEY,
      },
    });
  }
}
