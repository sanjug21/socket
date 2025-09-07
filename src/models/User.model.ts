import bcrypt from 'bcryptjs';
import mongoose, { Document, Schema } from 'mongoose';

export interface User extends Document {
  email: string;
  name: string;
  password: string;

  dp?: string;
  bio?: string;
  online?: boolean;

  nickname?: string;
  phone?: string;
  dob?: string;       
  address?: string;
  gender?: string;

}

const UserSchema: Schema<User> = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    dp: {
      type: String,
      default: '',
      trim: true,
    },
    bio: {
      type: String,
      default: '',
      maxlength: 160,
      trim: true,
    },
    online: {
      type: Boolean,
      default: false,
    },
    nickname: {
      type: String,
      default: '',
      trim: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    dob: {
      type: String,
      default: '',
      trim: true,
    },
    address: {
      type: String,
      default: '',
      trim: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', ''],
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

UserSchema.pre<User>('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.models.User || mongoose.model<User>('User', UserSchema);
