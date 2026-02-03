import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
  isPro: boolean;
  stripeCustomerId?: string;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // In production, use bcrypt to hash this
  isPro: { type: Boolean, default: false }, // Week 3 Stripe integration target
  stripeCustomerId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);