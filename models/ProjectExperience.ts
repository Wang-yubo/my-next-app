import mongoose, { Schema, Model } from 'mongoose';

export interface IProjectExperience {
  _id?: string;
  studentId: string; // 学生ID（关联Student表）
  projectName: string; // 项目名称
  description: string; // 项目描述
  role: string; // 担任角色
  technologies: string[]; // 技术栈
  startDate: Date; // 开始时间
  endDate?: Date; // 结束时间
  isOngoing: boolean; // 是否进行中
  achievements?: string; // 项目成果
  githubUrl?: string; // GitHub链接
  demoUrl?: string; // 演示链接
  createdAt: Date; // 创建时间
  updatedAt: Date; // 更新时间
}

const projectExperienceSchema = new Schema<IProjectExperience>(
  {
    studentId: {
      type: String,
      required: true,
      index: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    technologies: {
      type: [String],
      default: [],
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    isOngoing: {
      type: Boolean,
      default: false,
    },
    achievements: {
      type: String,
    },
    githubUrl: {
      type: String,
    },
    demoUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// 创建索引
projectExperienceSchema.index({ studentId: 1, startDate: -1 });

const ProjectExperience: Model<IProjectExperience> =
  mongoose.models.ProjectExperience ||
  mongoose.model<IProjectExperience>('ProjectExperience', projectExperienceSchema);

export default ProjectExperience;
