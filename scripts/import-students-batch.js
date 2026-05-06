const mongoose = require('mongoose');
const students = require('./seed-students-batch');
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

    // 注册 ts-node 以支持 TypeScript 模块
    require('ts-node').register({
      compilerOptions: {
        module: 'commonjs',
        target: 'es2017',
        esModuleInterop: true
      }
    });
    
    // 导入 Student 模型
    const Student = require('../models/Student').default;

    console.log('\n========== 开始导入学生数据 ==========');
    console.log(`待导入学生数量: ${students.length}\n`);

    // 检查并插入数据
    let insertedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const studentData of students) {
      try {
        // 检查是否已存在
        const existing = await Student.findOne({ id: studentData.id });
        
        if (existing) {
          console.log(`⊘ 跳过已存在的学生: ${studentData.name} (${studentData.id})`);
          skippedCount++;
        } else {
          await Student.create(studentData);
          console.log(`✓ 添加学生: ${studentData.name} (${studentData.id}) - ${studentData.major}`);
          insertedCount++;
        }
      } catch (error) {
        console.error(`✗ 导入学生 ${studentData.name} (${studentData.id}) 失败: ${error.message}`);
        errorCount++;
      }
    }

    console.log('\n========== 导入完成 ==========');
    console.log(`✓ 成功插入: ${insertedCount} 条`);
    console.log(`⊘ 跳过重复: ${skippedCount} 条`);
    console.log(`✗ 导入失败: ${errorCount} 条`);
    console.log(`📊 总计处理: ${students.length} 条`);
    console.log('\n💡 提示: 所有学生使用相同密码: aaAA13579@');
    
    process.exit(0);
  } catch (error) {
    console.error(`\n❌ 导入失败: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
};

// 执行导入
importData();
