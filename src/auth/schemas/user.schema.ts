import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../interfaces/user.interface';
import { Model } from 'mongoose';

export interface UserObject extends User {
  validatePassword: (str: string) => boolean;
}

export const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  salt: String,
});

UserSchema.methods.validatePassword = async function(password: string): Promise<boolean> {
  const hash = await bcrypt.hash(password, this.salt);
  return hash === this.password;
};
