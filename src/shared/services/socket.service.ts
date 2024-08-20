import { injectable } from 'inversify';
import axios from 'axios';

@injectable()
export class SocketService {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async publishSocket(path, data): Promise<string> {
    const response = await axios.post(
      `${process.env.SOCKET_URL}/${path}`,
      data,
    );
    // console.log(response.data);
    return response.data;
  }
}
