import mongoose, { Schema, Model } from 'mongoose';

export interface IReflection {
  _id?: string;
  studentId: string; // 学生ID（关联Student表）
  title: string; // 心得标题
  content: string; // 心得内容
  category: '学习感悟' | '生活随笔' | '职业规划' | '其他'; // 分类
  mood?: '开心' | '平静' | '思考' | '困惑' | '兴奋'; // 心情标签
  tags: string[]; // 标签数组
  coverImage?: string; // 封面图片（可选）
  isPublished: boolean; // 是否公开
  viewCount?: number; // 浏览次数
  createdAt: Date; // 创建时间
  updatedAt: Date; // 更新时间
}

const reflectionSchema = new Schema<IReflection>(
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
    category: {
      type: String,
      enum: ['学习感悟', '生活随笔', '职业规划', '其他'],
      default: '其他',
    },
    mood: {
      type: String,
      enum: ['开心', '平静', '思考', '困惑', '兴奋'],
    },
    tags: {
      type: [String],
      default: [],
    },
    coverImage: {
      type: String,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// 创建索引
reflectionSchema.index({ studentId: 1, createdAt: -1 });
reflectionSchema.index({ category: 1 });

const Reflection: Model<IReflection> =
  mongoose.models.Reflection || mongoose.model<IReflection>('Reflection', reflectionSchema);

export default Reflection;
