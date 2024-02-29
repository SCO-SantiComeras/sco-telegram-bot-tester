import * as bcrypt from 'bcrypt';
import { Schema } from 'mongoose';
import { IUser } from '../interface/iuser.interface';
import { RoleConstants } from '../constants/role.constants';

export const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    active: {
      type: Boolean,
      required: false,
      default: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
      default: RoleConstants.USER,
    },
    pwdRecoveryToken: {
      type: String,
      required: false,
      default: null,
    },
    pwdRecoveryDate: {
      type: Date,
      required: false,
      default: null,
    },
    typeObj: {
      type: String,
      required: false,
      default: 'User',
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre<IUser>('save', async function () {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;
});
