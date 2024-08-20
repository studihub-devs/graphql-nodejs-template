import { injectable } from 'inversify';
import axios from 'axios';

@injectable()
export class Ec2Service {
  async getInstanceId(): Promise<string> {
    const response = await axios.get(
      'http://169.254.169.254/latest/meta-data/instance-id',
    );
    return response.data;
  }
}
