/* eslint-disable lines-between-class-members */
import { Router } from 'express';
import { validator } from '@middlewares/validator';
import authController from '@controllers/Auth.controllers';
import userDto from '@dtos/user.dto';

class AuthRoute {
  private router;
  private controller = new authController();
  private validator = validator;
  private dto = userDto;
  constructor() {
    this.router = Router();
  }
  initRoutes() {
    this.router.route('/signup').post(this.validator(this.dto.create), this.controller.signup);
    this.router.route('/signin').post(this.validator(this.dto.login), this.controller.login);
    return this.router;
  }
}

export default new AuthRoute();
