import amqplib, { Channel, Connection } from 'amqplib';
import { Dictionary } from 'express-serve-static-core';
import { injectable } from 'inversify';
import { Kafka } from 'kafkajs';

@injectable()
export class KafkaService {
  private kafkaCnt;
  private producer;

  // constructor() {}

  async connect() {
    this.kafkaCnt = new Kafka({
      clientId: 'graphql-api',
      brokers: JSON.parse(process.env.KAFKA_BROKER),
    });

    this.producer = this.kafkaCnt.producer();
    await this.producer.connect();
  }

  async produce(topic, dict_msg) {
    try {
      // if (this.producer == undefined) {
      //   await this.connect();
      // }
      // await this.producer.send({
      //   topic: topic,
      //   messages: [{ value: dict_msg }],
      // });
    } catch (error) {
      console.log('Kafka Error', error);
    }
  }
}
