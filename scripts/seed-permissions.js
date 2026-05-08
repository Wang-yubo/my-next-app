const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-management';

const seedPermissions = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB 连接成功');

    require('ts-node').register({
      compilerOptions: { module: 'commonjs', target: 'es2017', esModuleInterop: true },
    });
    const Role = require('../models/Role').default;

    // 超级管理员 — 空数组 = 拥有所有权限（无需显式列出）
    const superAdmin = await Role.findOne({ code: 'super_admin' });
    if (superAdmin) {
      superAdmin.permissions = [];
      await superAdmin.save();
      console.log(`✅ ${superAdmin.name} — 已清空权限列表（空数组=全权限）`);
    }

    // 教务管理员 — 显式分配后台管理权限
    const eduAdmin = await Role.findOne({ code: 'edu_admin' });
    if (eduAdmin) {
      eduAdmin.permissions = [
        'admin:dashboard',
        'admin:users',
        'admin:permissions',
        'admin:monitor',
      ];
      await eduAdmin.save();
      console.log(`✅ ${eduAdmin.name} — 已分配 ${eduAdmin.permissions.length} 个权限（含系统监控）`);
    }

    console.log('\n========== 权限更新完成 ==========');
    console.log('请重新登录后生效');

    process.exit(0);
  } catch (error) {
    console.error('更新失败:', error.message);
    process.exit(1);
  }
};

seedPermissions();
