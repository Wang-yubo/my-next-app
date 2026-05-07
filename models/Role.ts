import mongoose, { Schema, Model } from 'mongoose';

export interface IRole {
  name: string;
  code: string;
  description: string;
  status: 'active' | 'disabled';
  permissions: string[];
  sort: number;
  createdAt: Date;
  updatedAt: Date;
}

const roleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'disabled'],
      default: 'active',
    },
    permissions: [
      {
        type: String,
      },
    ],
    sort: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

roleSchema.index({ code: 1 });

const Role: Model<IRole> =
  mongoose.models.Role || mongoose.model<IRole>('Role', roleSchema);

export default Role;
