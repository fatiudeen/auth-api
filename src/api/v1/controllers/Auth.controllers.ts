/* eslint-disable lines-between-class-members */
import { Request, Response, NextFunction } from 'express';
import { UserInterface } from '@interfaces/User.interface';
import HttpResponse from '@helpers/HttpResponse';
import HttpError from '@helpers/HttpError';
import UserController from '@controllers/User.controllers';
import { MESSAGES } from '@config';

class AuthController extends UserController {
  signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if ((await this.service.findOne({ username: req.body.username })) !== null) {
        throw new HttpError(MESSAGES.USER_EXISTS, 400);
      }
      const password = await this.service.genHash(req.body.password);
      const data = <UserInterface>{ ...req.body, password };
      const user = await this.service.create(data);
      const token = this.service.getSignedToken(<any>user);
      HttpResponse.send(res, { user, token });
    } catch (error) {
      next(error);
    }
  };
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;
      const user = await this.service.findOne({ username });
      if (!user) {
        throw new HttpError(MESSAGES.INVALID_CREDENTIALS, 400);
      }

      const comparePasswords = this.service.comparePasswords(password, user);
      if (!comparePasswords) {
        throw new HttpError(MESSAGES.INVALID_CREDENTIALS, 400);
      }
      const token = this.service.getSignedToken(<any>user);

      HttpResponse.send(res, { user, token });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
