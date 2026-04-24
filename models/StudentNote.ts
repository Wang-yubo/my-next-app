import mongoose, { Schema, Model } from 'mongoose';

export interface IStudentNote {
  _id?: string;
  studentId: string; // 学生ID（关联Student表）
  title: string; // 笔记标题
  content: string; // 笔记内容
  courseName?: string; // 课程名称（可选）
  tags: string[]; // 标签数组
  createdAt: Date; // 创建时间
  updatedAt: Date; // 更新时间
}

const studentNoteSchema = new Schema<IStudentNote>(
  {
    studentId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    courseName: {
      type: String,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// 创建索引
studentNoteSchema.index({ studentId: 1, createdAt: -1 });

const StudentNote: Model<IStudentNote> =
  mongoose.models.StudentNote || mongoose.model<IStudentNote>('StudentNote', studentNoteSchema);

export default StudentNote;
