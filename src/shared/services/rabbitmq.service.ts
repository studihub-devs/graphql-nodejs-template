import amqplib, { Channel, Connection } from 'amqplib';
import { Dictionary } from 'express-serve-static-core';
import { injectable } from 'inversify';

@injectable()
export class RabbitMQService {
  //   private channel: Channel;
  private connection: Connection;
  private exch = 'reviewty-dev-exchange';
  private rkey = 'reviewty-dev-route';
  private channelMap: Dictionary<Channel> = {};
  constructor() {
    // this.connect();
  }
  async connect() {
    try {
      const amqpServer = process.env.RABBIT_URL;
      this.connection = await amqplib.connect(amqpServer, 'heartbeat=0');
      await this.createChannel(process.env.RABBIT_TOPIC);
    } catch (error) {
      console.log(error);
    }
  }
  async createChannel(name) {
    const channel = await this.connection.createChannel();

    await channel.assertQueue(name, {
      durable: false,
    });

    this.channelMap[name] = channel;
  }

  async produce(topic, msg) {
    try {
      // console.log('Publishing to', topic);
      if (this.connection == undefined) {
        await this.connect();
      }
      if (!(topic in this.channelMap)) {
        await this.createChannel(topic);
      }
      const channel = this.channelMap[topic];
      await channel.publish('', topic, Buffer.from(msg));
    } catch (error) {
      console.log('Rabbit Error', error);
    }
  }
}
