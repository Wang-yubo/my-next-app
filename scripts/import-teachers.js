const mongoose = require('mongoose');
const teachers = require('./teachers.json');
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

// 导入教师数据
const importData = async () => {
  try {
    await connectDB();

    // 导入 Teacher 模型
    require('ts-node').register({
      compilerOptions: {
        module: 'commonjs',
        target: 'es2017',
        esModuleInterop: true
      }
    });
    const Teacher = require('../models/Teacher').default;

    // 检查并插入数据
    let insertedCount = 0;
    let skippedCount = 0;

    for (const teacherData of teachers) {
      // 检查是否已存在
      const existing = await Teacher.findOne({ id: teacherData.id });
      
      if (existing) {
        console.log(`跳过已存在的教师: ${teacherData.name} (${teacherData.id})`);
        skippedCount++;
      } else {
        await Teacher.create({
          ...teacherData,
          hireDate: new Date(teacherData.hireDate.$date)
        });
        console.log(`添加教师: ${teacherData.name} (${teacherData.id})`);
        insertedCount++;
      }
    }

    console.log('\n========== 导入完成 ==========');
    console.log(`成功插入: ${insertedCount} 条`);
    console.log(`跳过重复: ${skippedCount} 条`);
    console.log(`总计处理: ${teachers.length} 条`);
    console.log('\n默认密码: aaAA13579@');
    
    process.exit(0);
  } catch (error) {
    console.error(`导入失败: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
};

// 执行导入
importData();
