import { injectable } from 'inversify';
import axios from 'axios';

@injectable()
export class FirebaseService {
  pushNotification(data?: unknown): void {
    axios.post('https://fcm.googleapis.com/fcm/send', data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          `key=` + `${process.env.FIREBASE_CLOUD_MESSAGING_SERVER_KEY}`,
      },
    });
  }

  createAndroidPayLoad(tokens: string[], data: unknown): any {
    return {
      registration_ids: tokens,
      data,
      content_available: true,
    };
  }

  createIOSPayload(
    tokens: string[],
    data: unknown,
    defaultMessage?: string,
  ): any {
    return {
      registration_ids: tokens,
      notification: {
        body: defaultMessage,
        sound: 'default',
      },
      mutable_content: true,
      content_available: true,
      data,
    };
  }

  async sendTopicNotification(data: {
    item_id: string;
    type: string;
    title: string;
    content?: string;
    image_url?: string;
    [key: string]: string;
  }): Promise<boolean> {
    return Promise.all([
      axios.post(
        process.env.FIREBASE_COULD_MSG,
        {
          to: process.env.FIREBASE_NOTIFICATION_TOPIC,
          data,
          content_available: true,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `key=${process.env.FIREBASE_CLOUD_MESSAGING_SERVER_KEY}`,
          },
        },
      ),
      axios.post(
        process.env.FIREBASE_COULD_MSG,
        {
          to: `${process.env.FIREBASE_NOTIFICATION_TOPIC}-ios`,
          notification: {
            title: data.title,
            body: data.content,
            sound: 'default',
          },
          data,
          content_available: true,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `key=${process.env.FIREBASE_CLOUD_MESSAGING_SERVER_KEY}`,
          },
        },
      ),
    ])
      .then(() => true)
      .catch(() => false);
  }
}
