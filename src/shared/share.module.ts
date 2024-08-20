import { ContainerModule, interfaces } from 'inversify';

import { S3Service } from './services/s3.service';
import { StringService } from './services/string.service';
import { OrderByService } from './services/order-by.service';
import { FBService } from './services/fb.service';
import { EmailService } from './services/email.service';
import { FirebaseService } from './services/firebase.service';
import { CacheService } from './services/cache.service';
import { JsonService } from './services/json.service';
import { AppleService } from './services/apple.service';
import { MediaPackageService } from './services/media-package.service';
import { MediaLiveService } from './services/media-live.service';
import { SsmService } from './services/ssm.service';
import { CloudFrontService } from './services/cloud-front.service';
import { Ec2Service } from './services/ec2.service';
import { RabbitMQService } from './services/rabbitmq.service';
import { CacheGatewayService } from './services/cache-gateway.service';
import { KafkaService } from './services/kafka.service';
import { IvsClientService } from './services/ivs-client.service';
import { SocketService } from './services/socket.service';
import { WinstonService } from './services/winston.service';

export const SharedModule = new ContainerModule((bind: interfaces.Bind) => {
  bind(S3Service)
    .toSelf()
    .inSingletonScope();
  bind(StringService)
    .toSelf()
    .inSingletonScope();
  bind(OrderByService)
    .toSelf()
    .inSingletonScope();
  bind(FBService)
    .toSelf()
    .inSingletonScope();
  bind(EmailService)
    .toSelf()
    .inSingletonScope();
  bind(FirebaseService)
    .toSelf()
    .inSingletonScope();
  bind(CacheService)
    .toSelf()
    .inSingletonScope();
  bind(JsonService)
    .toSelf()
    .inSingletonScope();
  bind(AppleService)
    .toSelf()
    .inSingletonScope();
  bind(MediaPackageService)
    .toSelf()
    .inSingletonScope();
  bind(MediaLiveService)
    .toSelf()
    .inSingletonScope();
  bind(SsmService)
    .toSelf()
    .inSingletonScope();
  bind(CloudFrontService)
    .toSelf()
    .inSingletonScope();
  bind(Ec2Service)
    .toSelf()
    .inSingletonScope();
  bind(RabbitMQService)
    .toSelf()
    .inSingletonScope();
  bind(CacheGatewayService)
    .toSelf()
    .inSingletonScope();
  bind(KafkaService)
    .toSelf()
    .inSingletonScope();
  bind(IvsClientService)
    .toSelf()
    .inSingletonScope();
  bind(SocketService)
    .toSelf()
    .inSingletonScope();
  bind(WinstonService)
    .toSelf()
    .inSingletonScope();
});
