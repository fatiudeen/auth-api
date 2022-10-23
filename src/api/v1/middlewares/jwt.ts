/* eslint-disable consistent-return */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import HttpError from '@helpers/HttpError';
import { MESSAGES, JWT_KEY } from '@config';
import UserService from '@services/User.service';
import { IUser } from '@interfaces/User.interface';

declare module 'express' {
  // eslint-disable-next-line no-shadow
  export interface Request {
    user?: IUser;
  }
}
// eslint-disable-next-line consistent-return
export const verify = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token =
      req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer'
        ? req.headers.authorization.split(' ')[1]
        : null;

    if (!token) {
      throw new HttpError(MESSAGES.UNAUTHORIZED, 401);
    }

    try {
      const decoded = <IUser>jwt.verify(token, <string>JWT_KEY);

      const userArray = await UserService.findOne(<string>decoded.id);
      const user = userArray[0];

      if (!user) {
        throw new HttpError(MESSAGES.UNAUTHORIZED, 401);
      }

      req.user = user;

      return next();
    } catch (error) {
      next(error);
    }
  } catch (error) {
    next(error);
  }
};
