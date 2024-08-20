import Express from 'express';
import { User } from '../../user/entities/user.entity';

export interface Context {
  user?: User;
  acceptVersion?: string;
  deviceToken?: string;
  readAfterWriteConsistence?: boolean;
  req: Express.Request;
}
