import { injectable } from 'inversify';
import winston, { Logger } from 'winston';
import WinstonCloudWatch from 'winston-cloudwatch';

import { Ec2Service } from './ec2.service';

@injectable()
export class WinstonService {
  logger: Logger;

  constructor(private ec2Service: Ec2Service) {
    this.logger = winston.createLogger({
      level: 'debug',
      format: winston.format.json(),
      exitOnError: false,
      transports: [],
      exceptionHandlers: [],
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.simple(),
        }),
      );
    } else {
      this.ec2Service.getInstanceId().then(instanceId => {
        this.logger.add(
          new WinstonCloudWatch({
            name: process.env.AWS_CLOUDWATCH_LOG_GROUP_NAME,
            awsAccessKeyId: process.env.AWS_ACCESS_KEY,
            awsSecretKey: process.env.AWS_SECRET_KEY,
            awsRegion: process.env.AWS_REGION,
            logGroupName: process.env.AWS_CLOUDWATCH_LOG_GROUP_NAME,
            logStreamName: instanceId,
            jsonMessage: true,
          }),
        );
      });
    }
  }
}
