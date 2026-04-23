# Token 认证系统使用说明

## ✅ 已完成的功能

### 1. JWT Token 认证系统
- ✅ 使用 HttpOnly Cookie 存储 Token（防止 XSS 攻击）
- ✅ JWT Token 有效期 7 天
- ✅ 支持学生和教师两种角色登录
- ✅ bcrypt 密码加密（salt rounds = 10）

### 2. API 接口
- ✅ `/api/register` - 用户注册（已更新为 bcrypt 加密）
- ✅ `/api/login` - 用户登录
- ✅ `/api/logout` - 退出登录

### 3. 路由保护
- ✅ 中间件保护 `/dashboard` 路径
- ✅ 已登录用户访问登录/注册页自动重定向到 dashboard
- ✅ 未登录用户访问 dashboard 自动重定向到登录页

### 4. 前端集成
- ✅ 登录页面实现真实登录逻辑
- ✅ Dashboard Layout 显示当前用户信息
- ✅ 退出登录功能

## 🚀 快速开始

### 1. 配置环境变量

确保 `.env.local` 文件中包含以下配置：

```env
MONGODB_URI=mongodb://localhost:27017/student-management
JWT_SECRET=your-super-secret-key-change-in-production
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**重要：** 生产环境请更换 `JWT_SECRET` 为强随机字符串！

生成强随机密钥的方法：
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. 启动开发服务器

```bash
pnpm dev
```

### 3. 测试流程

#### 步骤 1：注册用户
1. 访问 http://localhost:3000/register
2. 选择角色（学生/教师）
3. 填写所有必填字段
4. 密码要求：
   - 长度大于 6 位
   - 必须包含字母、数字、符号中的至少两种组合
5. 提交注册

#### 步骤 2：登录系统
1. 访问 http://localhost:3000
2. 输入学号/工号或邮箱
3. 选择对应的角色
4. 输入密码
5. 点击登录

#### 步骤 3：验证登录状态
- 成功登录后会自动跳转到 `/dashboard`
- 右上角会显示用户名
- 可以尝试直接访问 dashboard 页面，应该能正常访问

#### 步骤 4：测试退出登录
1. 点击右上角用户头像
2. 选择"退出登录"
3. 验证是否跳转回登录页
4. 尝试再次访问 dashboard，应该被重定向到登录页

## 🔐 安全特性

### 1. 密码加密
- 使用 bcrypt 算法加密密码
- Salt rounds = 10（平衡安全性和性能）
- 前端不加密，后端统一处理

### 2. Token 安全
- HttpOnly Cookie：JavaScript 无法访问，防止 XSS 攻击
- Secure Flag：生产环境仅通过 HTTPS 传输
- SameSite = Strict：防止 CSRF 攻击
- 7 天过期时间

### 3. 路由保护
- 服务端中间件验证 Token
- 未授权访问自动重定向

## 📝 技术实现细节

### JWT Payload 结构
```typescript
interface JWTPayload {
  userId: string;      // 用户 ID（学号/工号）
  role: 'student' | 'teacher';  // 用户角色
  email: string;       // 邮箱
  name: string;        // 姓名
}
```

### Cookie 配置
```typescript
{
  httpOnly: true,           // 防止 XSS
  secure: process.env.NODE_ENV === 'production',  // 生产环境 HTTPS
  sameSite: 'strict',       // 防止 CSRF
  maxAge: 7 * 24 * 60 * 60, // 7 天
  path: '/',                // 全站可用
}
```

### 登录流程
1. 用户提交登录表单
2. 后端验证用户名和密码
3. 使用 bcrypt.compare() 验证密码
4. 生成 JWT Token
5. 设置 HttpOnly Cookie
6. 返回用户信息
7. 前端保存用户信息到 localStorage（用于显示）
8. 跳转到 dashboard

### 退出登录流程
1. 调用 `/api/logout` API
2. 清除 HttpOnly Cookie
3. 清除 localStorage 中的用户信息
4. 跳转到登录页

## ⚠️ 注意事项

### 1. 已有数据的兼容性
如果之前已经注册过用户（使用 SHA256 加密），需要重新注册，因为密码加密方式已改为 bcrypt。

### 2. 生产环境部署
- **必须**更改 `JWT_SECRET` 为强随机字符串
- **必须**启用 HTTPS（secure flag 才会生效）
- 建议添加 Rate Limiting 防止暴力破解
- 考虑添加 Refresh Token 机制

### 3. 浏览器兼容性
HttpOnly Cookie 在所有现代浏览器中都受支持。

## 🐛 常见问题

### Q1: 登录后刷新页面仍然保持登录状态吗？
A: 是的，Token 存储在 HttpOnly Cookie 中，浏览器会自动携带，刷新页面不会丢失登录状态。

### Q2: 如何修改 Token 过期时间？
A: 修改 `lib/auth.ts` 中的 `TOKEN_EXPIRY` 常量，例如改为 `'1d'` 表示 1 天。

### Q3: 如何实现记住我功能？
A: 可以在登录时根据用户选择设置不同的 maxAge，例如：
- 记住我：30 天
- 不记住：会话级别（关闭浏览器失效）

### Q4: 如何强制用户下线？
A: 当前方案使用无状态 JWT，无法单独使某个 Token 失效。如需此功能，建议改用 Session + Redis 方案。

## 📚 相关文件

- `lib/auth.ts` - JWT 认证工具函数
- `middleware.ts` - 路由保护中间件
- `app/api/login/route.ts` - 登录 API
- `app/api/logout/route.ts` - 退出登录 API
- `app/api/register/route.ts` - 注册 API（已更新）
- `app/page.tsx` - 登录页面
- `app/dashboard/layout.tsx` - Dashboard 布局（含用户信息显示）

## 🔧 后续优化建议

1. **添加 Refresh Token**
   - 实现无感刷新 Token
   - 提升用户体验

2. **添加 Rate Limiting**
   - 限制登录尝试次数
   - 防止暴力破解

3. **添加登录日志**
   - 记录登录时间、IP
   - 异常登录提醒

4. **双因素认证（2FA）**
   - 增强账户安全性

5. **密码重置功能**
   - 通过邮箱找回密码

6. **Session 管理**
   - 查看活跃会话
   - 远程注销设备
