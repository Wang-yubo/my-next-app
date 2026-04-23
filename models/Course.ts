import mongoose, { Schema, Model } from 'mongoose';

export interface ICourse {
  courseCode: string; // 课程编号（唯一标识）
  courseName: string; // 课程名称
  description: string; // 课程描述/简介
  credit: number; // 学分（1-6分）
  hours: number; // 学时（总课时数）
  semester: string; // 开课学期（例如：2024年秋季学期）
  textbook: {
    title: string; // 教材名称
    author: string; // 作者
    publisher: string; // 出版社
    isbn: string; // ISBN号
    price: number; // 价格
  };
  teacher: {
    name: string; // 授课教师姓名
    title: string; // 教师职称
    email: string; // 教师邮箱
    phone: string; // 教师电话
  };
  classroom: {
    building: string; // 教学楼名称
    roomNumber: string; // 教室编号
    capacity: number; // 教室容量
    location: string; // 详细位置描述
  };
  tuition: number; // 学费
  maxStudents: number; // 最大选课人数
  enrolledStudents: number; // 已选课人数
  status: '开设中' | '已结课' | '待审核'; // 课程状态
  schedule: string; // 上课时间（例如：周一 3-4节）
  prerequisite: string[]; // 先修课程列表
  createdAt: Date; // 记录创建时间
  updatedAt: Date; // 记录更新时间
}

const courseSchema = new Schema<ICourse>(
  {
    courseCode: {
      type: String,
      required: true,
      unique: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    credit: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
    },
    hours: {
      type: Number,
      required: true,
    },
    semester: {
      type: String,
      required: true,
    },
    textbook: {
      title: {
        type: String,
        required: true,
      },
      author: {
        type: String,
        required: true,
      },
      publisher: {
        type: String,
        required: true,
      },
      isbn: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    teacher: {
      name: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
    classroom: {
      building: {
        type: String,
        required: true,
      },
      roomNumber: {
        type: String,
        required: true,
      },
      capacity: {
        type: Number,
        required: true,
        min: 1,
      },
      location: {
        type: String,
        required: true,
      },
    },
    tuition: {
      type: Number,
      required: true,
      min: 0,
    },
    maxStudents: {
      type: Number,
      required: true,
      min: 1,
    },
    enrolledStudents: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['开设中', '已结课', '待审核'],
      default: '开设中',
    },
    schedule: {
      type: String,
      required: true,
    },
    prerequisite: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// 创建索引
courseSchema.index({ courseCode: 1 });
courseSchema.index({ courseName: 1 });
courseSchema.index({ status: 1 });
courseSchema.index({ teacher: { name: 1 } });

const Course: Model<ICourse> =
  mongoose.models.Course || mongoose.model<ICourse>('Course', courseSchema);

export default Course;
