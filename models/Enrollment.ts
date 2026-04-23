import mongoose, { Schema, Model } from 'mongoose';

export interface IEnrollment {
  _id: string; // MongoDB自动生成的ID
  studentId: string; // 学生学号（关联Student表）
  courseId: string; // 课程ID（关联Course表）
  courseCode: string; // 课程编号
  courseName: string; // 课程名称
  credit: number; // 课程学分
  teacher: string; // 授课教师姓名
  schedule: string; // 上课时间
  classroom: string; // 上课教室
  enrollDate: Date; // 选课日期
  status: '已选课' | '已退课'; // 选课状态
  createdAt: Date; // 记录创建时间
  updatedAt: Date; // 记录更新时间
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
