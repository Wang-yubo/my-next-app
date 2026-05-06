const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// 连接 MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB 连接成功: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB 连接失败: ${error.message}`);
    process.exit(1);
  }
};

// 为学生设置默认密码
const setDefaultPassword = async () => {
  try {
    await connectDB();

    // 导入 Student 模型（使用 .ts 扩展名）
    require('ts-node').register({
      compilerOptions: {
        module: 'commonjs',
        target: 'es2017',
        esModuleInterop: true
      }
    });
    const Student = require('../models/Student').default;

    // 查找所有 password 为空或不存在的学生
    const studentsWithoutPassword = await Student.find({
      $or: [
        { password: { $exists: false } },
        { password: null },
        { password: '' }
      ]
    });

    if (studentsWithoutPassword.length === 0) {
      console.log('所有学生已有密码，无需更新');
      process.exit(0);
    }

    console.log(`找到 ${studentsWithoutPassword.length} 个需要设置密码的学生`);

    // 默认密码
    const defaultPassword = 'aaAA13579@';
    
    // 使用 bcrypt 加密密码
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // 批量更新
    let updatedCount = 0;
    for (const student of studentsWithoutPassword) {
      await Student.findByIdAndUpdate(student._id, {
        password: hashedPassword
      });
      console.log(`已为学生 ${student.name} (${student.id}) 设置默认密码`);
      updatedCount++;
    }

    console.log('\n========== 更新完成 ==========');
    console.log(`成功更新: ${updatedCount} 条记录`);
    console.log(`默认密码: ${defaultPassword}`);
    console.log('\n⚠️  重要提示: 请通知学生登录后立即修改密码！');
    
    process.exit(0);
  } catch (error) {
    console.error(`更新失败: ${error.message}`);
    process.exit(1);
  }
};

// 执行更新
setDefaultPassword();
