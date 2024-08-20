import express from 'express';

export const healthCheckRouter = express.Router();
healthCheckRouter.get('/health-check', (res, rep) => {
  return rep.status(200).send('System is ok');
});
