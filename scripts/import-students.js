const mongoose = require('mongoose');
const students = require('./seed-students');
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

// 导入学生数据
const importData = async () => {
  try {
    await connectDB();

    // 导入 Student 模型
    const Student = require('../models/Student').default;

    // 清空现有数据（可选）
    // await Student.deleteMany({});
    // console.log('已清空现有数据');

    // 检查并插入数据
    let insertedCount = 0;
    let skippedCount = 0;

    for (const studentData of students) {
      // 检查是否已存在
      const existing = await Student.findOne({ id: studentData.id });
      
      if (existing) {
        console.log(`跳过已存在的学生: ${studentData.name} (${studentData.id})`);
        skippedCount++;
      } else {
        await Student.create(studentData);
        console.log(`添加学生: ${studentData.name} (${studentData.id})`);
        insertedCount++;
      }
    }

    console.log('\n========== 导入完成 ==========');
    console.log(`成功插入: ${insertedCount} 条`);
    console.log(`跳过重复: ${skippedCount} 条`);
    console.log(`总计处理: ${students.length} 条`);
    
    process.exit(0);
  } catch (error) {
    console.error(`导入失败: ${error.message}`);
    process.exit(1);
  }
};

// 执行导入
importData();
