import mongoose, { Schema, Model } from 'mongoose';

export interface IAdminUser {
  username: string;
  password: string;
  email: string;
  nickname: string;
  avatar: string;
  status: 'active' | 'disabled';
  roles: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const adminUserSchema = new Schema<IAdminUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    nickname: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'disabled'],
      default: 'active',
    },
    roles: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Role',
      },
    ],
  },
  {
    timestamps: true,
  }
);

adminUserSchema.index({ username: 1 });
adminUserSchema.index({ email: 1 });

const AdminUser: Model<IAdminUser> =
  mongoose.models.AdminUser || mongoose.model<IAdminUser>('AdminUser', adminUserSchema);

export default AdminUser;
