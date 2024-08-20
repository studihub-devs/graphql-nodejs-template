import { Knex } from 'knex';

const config: Record<string, Knex.Config> = {
  test: {
    client: 'pg',
    connection: {
      host: 'localhost',
      port: 5432,
      database: 'studihub',
      user: 'studihub',
      password: '123456aA',
      supportBigNumbers: true,
      bigNumberStrings: true,
    },
    migrations: {
      directory: __dirname + '/.migrations',
    },
    seeds: {
      directory: __dirname + '/.seeds',
    },
  },
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      supportBigNumbers: true,
      bigNumberStrings: true,
    },
    migrations: {
      directory: __dirname + '/.migrations',
    },
    seeds: {
      directory: __dirname + '/.seeds',
    },
  },
  production: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    migrations: {
      directory: __dirname + '/.migrations',
    },
    seeds: {
      directory: __dirname + '/.seeds',
    },
  },
};
export default config;
