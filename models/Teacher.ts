import mongoose, { Schema, Model } from 'mongoose';

export interface ITeacher {
  id: string; // 工号（唯一标识）
  name: string; // 姓名
  gender: '男' | '女'; // 性别
  age: number; // 年龄
  department: string; // 所属院系
  researchArea: string; // 研究方向/专业领域
  officeLocation: string; // 办公地点（例如：计算机楼301室）
  title: '教授' | '副教授' | '讲师' | '助教'; // 职称
  phone: string; // 手机号码
  email: string; // 电子邮箱
  password: string; // 密码（加密存储）
  education: '博士' | '硕士' | '本科'; // 学历
  hireDate: Date; // 入职日期
  status: '在职' | '离职' | '休假'; // 工作状态
  createdAt: Date; // 记录创建时间
  updatedAt: Date; // 记录更新时间
}

const teacherSchema = new Schema<ITeacher>(
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
    department: {
      type: String,
      required: true,
    },
    researchArea: {
      type: String,
      required: true,
    },
    officeLocation: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      enum: ['教授', '副教授', '讲师', '助教'],
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
    password: {
      type: String,
      required: true,
    },
    education: {
      type: String,
      enum: ['博士', '硕士', '本科'],
      required: true,
    },
    hireDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['在职', '离职', '休假'],
      default: '在职',
    },
  },
  {
    timestamps: true,
  }
);

// 创建索引
teacherSchema.index({ id: 1 });
teacherSchema.index({ name: 1 });
teacherSchema.index({ department: 1 });
teacherSchema.index({ title: 1 });

const Teacher: Model<ITeacher> =
  mongoose.models.Teacher || mongoose.model<ITeacher>('Teacher', teacherSchema);

export default Teacher;
