import 'reflect-metadata';
import jwt from 'jsonwebtoken';
import {
  GraphQLRequestContext,
  BaseContext,
  GraphQLRequestListener,
} from 'apollo-server-plugin-base';

// import { request } from 'http';

// import Redis from 'ioredis';
import { hash } from 'bcryptjs';
import { KafkaService } from './shared/services/kafka.service';

// const redisPubSub = new Redis(
//   `redis://${process.env.LOGGER_REDIS_HOST}:${process.env.LOGGER_REDIS_PORT}`,
// );

const kafkaService = new KafkaService();

const parse_log = async (
  secret_key: string,
  requestContext: GraphQLRequestContext,
) => {
  let decoded = {};
  try {
    decoded = jwt.verify(
      requestContext.request.http.headers
        .get('Authorization')
        .replace('Bearer ', ''),
      secret_key,
    );
  } catch (err) {
    // console.log(err);
  }

  const requestHeader = {};
  const iterator = requestContext.request.http.headers.entries();
  let next;

  while ((next = iterator.next()).done === false) {
    requestHeader[next.value[0]] = next.value[1];
  }

  // Removing the value of password from login information
  let valuesInfo = {};

  if (
    requestContext.request.variables != null &&
    requestContext.request.variables != undefined
  ) {
    valuesInfo = JSON.parse(JSON.stringify(requestContext.request.variables));
  }
  delete valuesInfo['password'];

  let session = requestContext.request.http.headers.get('Authorization');
  if (session != null) {
    session = await hash(session, 10);
  }

  const dataLog = {
    time: Date.now(),
    query: requestContext.request.query,
    values: valuesInfo,
    url: requestContext.request.http.url,
    method: requestContext.request.http.method,
    session: session,
    header: requestHeader,
    userInfor: decoded,
  };

  // kafkaService.produce(
  //   'graphql-api',
  //   JSON.stringify({ event: 'graphql-api', message: dataLog }),
  // );

  return {};
};

const loggingMobilePlugin = {
  requestDidStart(
    requestContext: GraphQLRequestContext,
  ): Promise<GraphQLRequestListener<BaseContext>> | any {
    return parse_log(process.env.JWT_SECRET_MOBILE, requestContext);
  },
};

const loggingAdminPlugin = {
  requestDidStart(
    requestContext: GraphQLRequestContext,
  ): Promise<GraphQLRequestListener<BaseContext>> | any {
    return parse_log(process.env.JWT_SECRET_ADMIN, requestContext);
  },
};

export { loggingMobilePlugin, loggingAdminPlugin };
