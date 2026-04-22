import mongoose, { Schema, Model } from 'mongoose';

export interface IEnrollment {
  _id: string;
  studentId: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  credit: number;
  teacher: string;
  schedule: string;
  classroom: string;
  enrollDate: Date;
  status: '已选课' | '已退课';
  createdAt: Date;
  updatedAt: Date;
}

const enrollmentSchema = new Schema<IEnrollment>(
  {
    studentId: {
      type: String,
      required: true,
    },
    courseId: {
      type: String,
      required: true,
    },
    courseCode: {
      type: String,
      required: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    credit: {
      type: Number,
      required: true,
    },
    teacher: {
      type: String,
      required: true,
    },
    schedule: {
      type: String,
      required: true,
    },
    classroom: {
      type: String,
      required: true,
    },
    enrollDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['已选课', '已退课'],
      default: '已选课',
    },
  },
  {
    timestamps: true,
  }
);

// 创建索引
enrollmentSchema.index({ studentId: 1 });
enrollmentSchema.index({ courseId: 1 });
enrollmentSchema.index({ courseCode: 1 });
enrollmentSchema.index({ status: 1 });

const Enrollment =
  mongoose.models.Enrollment || mongoose.model('Enrollment', enrollmentSchema);

export default Enrollment;
