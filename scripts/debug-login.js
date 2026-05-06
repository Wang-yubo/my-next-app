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
    const Student = require('../models/Student').default;
    
    const email = '760478684@qq.com';
    
    // 使用 findOne 查询
    const user = await Student.findOne({ 
      $or: [{ email: email }, { id: email }] 
    });
    
    console.log('查询结果:');
    if (user) {
      console.log('- 找到用户:', user.name);
      console.log('- 用户对象 keys:', Object.keys(user.toObject()));
      console.log('- password 字段值:', user.password);
      console.log('- password 类型:', typeof user.password);
      console.log('- password 是否为空:', !user.password);
      console.log('- password 长度:', user.password ? user.password.length : 0);
      
      // 检查完整对象
      console.log('\n完整用户对象:');
      console.log(JSON.stringify(user.toObject(), null, 2));
    } else {
      console.log('- 未找到用户');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('错误:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
})();
