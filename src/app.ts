import bodyParser = require('body-parser');
import express = require('express');
import { Application } from 'express';
import helmet from 'helmet';
import passport from 'passport';
import passportJWT from 'passport-jwt';
import { to } from 'await-to-js';
import { plainToClass } from 'class-transformer';

import { container } from './inversify.config';
import { CacheService } from './shared/services/cache.service';
import knex from './knex';
import { User } from './user/entities/user.entity';
import { healthCheckRouter } from './k8s/routers/health-check.router';

import { KafkaService } from './shared/services/kafka.service';
import { WinstonService } from './shared/services/winston.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieParser = require('cookie-parser');

const winstonService = container.get(WinstonService);

const kafkaService = new KafkaService();

export const initApp = (): express.Application => {
  const app = express();

  app.use(cookieParser());

  app.use((req, res, next) => {
    if (req.get('x-amz-sns-message-type')) {
      req.headers['content-type'] = 'application/json';
    }
    next();
  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(helmet());

  const cookieExtractor = function(req) {
    let token = null;

    if (req && req.cookies) {
      token = req.cookies['jwt'];
    }

    return token;
  };

  passport.use(
    'user-strategy',
    new passportJWT.Strategy(
      {
        secretOrKey: process.env.JWT_SECRET_MOBILE,
        jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([
          cookieExtractor,
          passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
        ]),
      },
      async (payload, done: passportJWT.VerifiedCallback) => {
        if (!payload.sub) {
          return done(null);
        }

        const cacheService = container.get(CacheService);
        const [error, user] = await to(
          cacheService.getOrSetH(`${User.name}.${payload.sub}`, '*', () =>
            knex
              .from('studihub.user')
              .select('*')
              .where({
                id: payload.sub,
                is_active: true,
              })
              .first()
              .then(row => plainToClass(User, row)),
          ),
        );

        if (error) {
          return done(error);
        }
        if (user == undefined) {
          return done(new Error('Blocked'));
        }
        return done(null, user);
      },
    ),
  );

  app.use(passport.initialize());
  app.use('/graphql', (req, res, next) => {
    passport.authenticate('user-strategy', { session: false }, (err, user) => {
      if (err && err.message == 'Blocked') {
        if (req.headers['authorization']) {
          res.status(505).send({ message: 'Account is blocked' });
          return next(err);
        } else {
          err = null;
        }
      }

      if (err) {
        return next(err);
      }
      if (user) {
        req['user'] = user;
      }

      next();
    })(req, res, next);
  });

  const requestTime = function(req, res, next) {
    const oldWrite = res.write;
    const oldEnd = res.end;

    const chunks = [];

    res.write = (...restArgs) => {
      chunks.push(Buffer.from(restArgs[0]));
      oldWrite.apply(res, restArgs);
    };

    res.end = (...restArgs) => {
      if (restArgs[0]) {
        chunks.push(Buffer.from(restArgs[0]));
      }
      const body = Buffer.concat(chunks).toString('utf8');

      const data = {
        time: new Date().toUTCString(),
        headers: req.headers,
        fromIP: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        method: req.method,
        originalUri: req.originalUrl,
        uri: req.url,
        requestData: req.body,
        responseData: body,
        referer: req.headers.referer || '',
        ua: req.headers['user-agent'],
      };

      oldEnd.apply(res, restArgs);
      if (body.includes('"errors":')) {
        try {
          kafkaService.produce(
            'api-error',
            JSON.stringify({
              source: 'client-api-error',
              message: data,
            }),
          );
          winstonService.logger.error(
            JSON.stringify({
              source: 'client-api-error',
              message: data,
            }),
          );
        } catch (err) {
          console.log(err);
        }
      }
    };
    req.requestTime = Date.now();
    next();
  };

  app.use(requestTime);
  app.use(healthCheckRouter);
  return app;
};
