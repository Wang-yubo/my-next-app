import mongoose, { Schema, Model } from 'mongoose';

export interface IStudent {
  id: string;
  name: string;
  gender: '男' | '女';
  age: number;
  major: string;
  grade: string;
  phone: string;
  email: string;
  status: '在读' | '休学' | '毕业';
  enrollDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const studentSchema = new Schema<IStudent>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ['男', '女'],
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    major: {
      type: String,
      required: true,
    },
    grade: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['在读', '休学', '毕业'],
      default: '在读',
    },
    enrollDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// 如果没有索引则创建索引
studentSchema.index({ id: 1 });
studentSchema.index({ name: 1 });
studentSchema.index({ major: 1 });

const Student: Model<IStudent> =
  mongoose.models.Student || mongoose.model<IStudent>('Student', studentSchema);

export default Student;
