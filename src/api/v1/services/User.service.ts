/* eslint-disable class-methods-use-this */
/* eslint-disable lines-between-class-members */
import { Model } from 'mongoose';
import User from '@models/User';
import { UserInterface } from '@interfaces/User.interface';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_KEY } from '@config';

class UserService {
  protected model;
  constructor(model: Model<UserInterface>) {
    this.model = model;
  }
  find(data?: Partial<UserInterface>) {
    const doc = data || {};
    return this.model.find(doc);
  }

  findOne(data: string | Partial<UserInterface>) {
    if (typeof data === 'object') return this.model.findOne(data);
    return this.model.findById(data);
  }

  update(query: string | Partial<UserInterface>, data: Partial<UserInterface>) {
    if (typeof query === 'object') return this.model.findOneAndUpdate(query, data);
    return this.model.findByIdAndUpdate(query, data, { new: true });
  }

  updateMany(query: Partial<UserInterface>, data: Partial<UserInterface>) {
    return this.model.updateMany(query, data);
  }
  create(data: UserInterface) {
    return this.model.create(data);
  }

  delete(data: string | Partial<UserInterface>) {
    if (typeof data === 'object') return this.model.findOneAndDelete(data);
    return this.model.findByIdAndDelete(data, { new: true });
  }

  load(id: string, data: Partial<UserInterface> | Partial<UserInterface>[]) {
    if (Array.isArray(data)) {
      return this.model.findByIdAndUpdate(id, { $push: { $each: data } }, { new: true });
    }
    return this.model.findByIdAndUpdate(id, { $push: data }, { new: true });
  }

  async genHash(password: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  comparePasswords(password: string, user: UserInterface) {
    return bcrypt.compare(password, user.password);
  }

  getSignedToken(user: UserInterface & { _id: string }) {
    // eslint-disable-next-line no-underscore-dangle
    return jwt.sign({ _id: user._id }, <string>JWT_KEY, {});
  }
}

export default new UserService(User);
