const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-management';

const roles = [
  {
    name: '超级管理员',
    code: 'super_admin',
    description: '拥有系统所有权限，可管理所有功能和设置',
    status: 'active',
    permissions: [],
    sort: 1,
  },
  {
    name: '教务管理员',
    code: 'edu_admin',
    description: '负责教务相关管理，可管理用户、角色和权限',
    status: 'active',
    permissions: [],
    sort: 2,
  },
  {
    name: '教师',
    code: 'teacher',
    description: '教师角色，可查看和管理教学相关数据',
    status: 'active',
    permissions: [],
    sort: 3,
  },
  {
    name: '学生',
    code: 'student',
    description: '学生角色，可查看个人相关数据及学习笔记',
    status: 'active',
    permissions: [],
    sort: 4,
  },
];

const seedRoles = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB 连接成功');

    require('ts-node').register({
      compilerOptions: {
        module: 'commonjs',
        target: 'es2017',
        esModuleInterop: true,
      },
    });
    const Role = require('../models/Role').default;

    let insertedCount = 0;
    let updatedCount = 0;

    for (const roleData of roles) {
      const existing = await Role.findOne({ code: roleData.code });

      if (existing) {
        await Role.findOneAndUpdate({ code: roleData.code }, roleData, { returnDocument: 'after' });
        console.log(`更新角色: ${roleData.name} (${roleData.code})`);
        updatedCount++;
      } else {
        await Role.create(roleData);
        console.log(`添加角色: ${roleData.name} (${roleData.code})`);
        insertedCount++;
      }
    }

    console.log('\n========== 角色数据同步完成 ==========');
    console.log(`成功插入: ${insertedCount} 条`);
    console.log(`成功更新: ${updatedCount} 条`);
    console.log(`总计处理: ${roles.length} 条`);

    process.exit(0);
  } catch (error) {
    console.error('初始化失败:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

seedRoles();
