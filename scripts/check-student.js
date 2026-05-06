const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
require('ts-node').register({ 
  compilerOptions: { 
    module: 'commonjs', 
    target: 'es2017', 
    esModuleInterop: true 
  } 
});

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const Student = require('./models/Student').default;
    
    // 查找该邮箱的学生
    const student = await Student.findOne({ email: '760478684@qq.com' });
    
    if (student) {
      console.log('找到学生:', JSON.stringify({
        id: student.id,
        name: student.name,
        email: student.email,
        hasPassword: !!student.password,
        passwordLength: student.password ? student.password.length : 0,
        passwordPreview: student.password ? student.password.substring(0, 10) + '...' : 'NO PASSWORD'
      }, null, 2));
    } else {
      console.log('未找到邮箱为 760478684@qq.com 的学生');
      
      // 显示所有学生的邮箱
      const allStudents = await Student.find({}, 'id name email password');
      console.log('\n所有学生信息:');
      allStudents.forEach(s => {
        console.log(`- ${s.email} (${s.name}) - 密码: ${s.password ? '已设置' : '未设置'}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('错误:', error.message);
    process.exit(1);
  }
})();
