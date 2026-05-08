import mongoose, { Schema, Model } from 'mongoose';

export interface IActivityLog {
  userId: string;
  username: string;
  name: string;
  role: string;
  action: 'login' | 'logout';
  ip: string;
  userAgent: string;
  createdAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    userId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['student', 'teacher', 'admin'],
    },
    action: {
      type: String,
      required: true,
      enum: ['login', 'logout'],
    },
    ip: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });
activityLogSchema.index({ userId: 1, createdAt: -1 });

const ActivityLog: Model<IActivityLog> =
  mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', activityLogSchema);

export default ActivityLog;
