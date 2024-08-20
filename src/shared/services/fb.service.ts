import FB from 'fb';
import { injectable } from 'inversify';

@injectable()
export class FBService {
  me(accessToken: string): Promise<FBLoginPayload> {
    return new Promise((resolve, reject) => {
      FB.api(
        'me',
        {
          fields: 'id,name,email,first_name,last_name',
          access_token: accessToken,
        },
        function(res) {
          if (!res || res.error) {
            reject(res.error);
          } else {
            resolve(res);
          }
        },
      );
    });
  }
}

export class FBLoginPayload {
  id: string;
  name?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}
