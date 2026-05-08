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
    permissions: ['admin:dashboard', 'admin:users', 'admin:permissions', 'admin:monitor'],
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
    description: '学生角色，可查看个人相关数据',
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
    let skippedCount = 0;

    for (const roleData of roles) {
      const existing = await Role.findOne({ code: roleData.code });

      if (existing) {
        console.log(`跳过已存在的角色: ${roleData.name} (${roleData.code})`);
        skippedCount++;
      } else {
        await Role.create(roleData);
        console.log(`添加角色: ${roleData.name} (${roleData.code})`);
        insertedCount++;
      }
    }

    console.log('\n========== 角色数据初始化完成 ==========');
    console.log(`成功插入: ${insertedCount} 条`);
    console.log(`跳过重复: ${skippedCount} 条`);
    console.log(`总计处理: ${roles.length} 条`);

    process.exit(0);
  } catch (error) {
    console.error('初始化失败:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

seedRoles();
