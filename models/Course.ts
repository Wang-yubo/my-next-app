import mongoose, { Schema, Model } from 'mongoose';

export interface ICourse {
  courseCode: string;
  courseName: string;
  description: string;
  credit: number;
  hours: number;
  semester: string;
  textbook: {
    title: string;
    author: string;
    publisher: string;
    isbn: string;
    price: number;
  };
  teacher: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
  classroom: {
    building: string;
    roomNumber: string;
    capacity: number;
    location: string;
  };
  tuition: number;
  maxStudents: number;
  enrolledStudents: number;
  status: '开设中' | '已结课' | '待审核';
  schedule: string;
  prerequisite: string[];
  createdAt: Date;
  updatedAt: Date;
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
