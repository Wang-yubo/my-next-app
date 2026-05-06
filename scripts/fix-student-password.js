const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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
    const Student = require('../models/Student').default;
    
    const email = '760478684@qq.com';
    const defaultPassword = 'aaAA13579@';
    
    // 查找该邮箱的学生
    const student = await Student.findOne({ email });
    
    if (!student) {
      console.log(`未找到邮箱为 ${email} 的学生`);
      process.exit(1);
    }
    
    console.log('找到学生:', {
      id: student.id,
      name: student.name,
      email: student.email,
      hasPassword: !!student.password
    });
    
    // 加密密码
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    
    // 更新密码
    await Student.findByIdAndUpdate(student._id, {
      password: hashedPassword
    });
    
    console.log(`\n✅ 已为学生 ${student.name} (${email}) 设置密码`);
    console.log(`默认密码: ${defaultPassword}`);
    
    // 验证密码是否正确
    const isMatch = await bcrypt.compare(defaultPassword, hashedPassword);
    console.log(`密码验证: ${isMatch ? '成功 ✓' : '失败 ✗'}`);
    
    process.exit(0);
  } catch (error) {
    console.error('错误:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
})();
