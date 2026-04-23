'use client';

import { Button, Input, Form, Select, DatePicker, message } from 'antd';
import { UserOutlined, LockOutlined, ScanOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import dayjs from 'dayjs';
import CryptoJS from 'crypto-js';

const { Option } = Select;

// 密码验证函数：必须包含大小写字母、数字、符号中的至少两种组合，长度大于6位
const validatePassword = (_: any, value: string) => {
  if (!value) {
    return Promise.reject(new Error('请输入密码!'));
  }
  
  if (value.length <= 6) {
    return Promise.reject(new Error('密码长度必须大于6位!'));
  }
  
  // 检查是否包含各类字符
  const hasLowercase = /[a-z]/.test(value);
  const hasUppercase = /[A-Z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSymbol = /[^a-zA-Z0-9]/.test(value);
  
  // 统计满足的条件数量（小写和大写合并为字母）
  let typeCount = 0;
  if (hasLowercase || hasUppercase) typeCount++;
  if (hasNumber) typeCount++;
  if (hasSymbol) typeCount++;
  
  if (typeCount < 2) {
    return Promise.reject(new Error('密码必须包含字母、数字、符号中的至少两种组合!'));
  }
  
  return Promise.resolve();
};

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [form] = Form.useForm();

  const handleRegister = async (values: any) => {
    setLoading(true);
    try {
      const requestData = {
        role,
        ...values,
        enrollDate: role === 'student' ? values.enrollDate?.format('YYYY-MM-DD') : undefined,
        hireDate: role === 'teacher' ? values.hireDate?.format('YYYY-MM-DD') : undefined,
        // 移除 confirmPassword，不发送到后端
        confirmPassword: undefined,
      };

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (result.success) {
        message.success('注册成功！即将跳转到登录页面...');
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        message.error(result.message || '注册失败');
      }
    } catch (error) {
      console.error('注册错误:', error);
      message.error('注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push('/');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0d1229 100%)',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 背景装饰 - 网格线 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          pointerEvents: 'none',
        }}
      />

      {/* 背景装饰 - 光晕效果 */}
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background:
            'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
          pointerEvents: 'none',
          animation: 'pulse 4s ease-in-out infinite',
        }}
      />

      {/* 左半部分 - 欢迎信息 (占2/3宽度) */}
      <div
        style={{
          flex: '0 0 66.666%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* 欢迎文字 */}
        <h1
          style={{
            fontSize: '120px',
            fontWeight: '900',
            margin: '0 0 20px 0',
            background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #1d4ed8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '20px',
            textShadow: '0 0 40px rgba(59, 130, 246, 0.5)',
            lineHeight: 1,
          }}
        >
          欢迎加入
        </h1>

        {/* 副标题 */}
        <p
          style={{
            fontSize: '24px',
            color: 'rgba(148, 163, 184, 0.9)',
            margin: '20px 0 50px 0',
            letterSpacing: '8px',
            fontWeight: '300',
          }}
        >
          学生信息管理系统
        </p>

        {/* 装饰线 */}
        <div
          style={{
            width: '200px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)',
            margin: '0 auto 50px',
          }}
        />

        {/* 特性标签 */}
        <div
          style={{
            display: 'flex',
            gap: '30px',
            justifyContent: 'center',
            marginBottom: '60px',
            flexWrap: 'wrap',
          }}
        >
          {['智能管理', '数据驱动', '高效便捷'].map((tag, index) => (
            <div
              key={index}
              style={{
                padding: '10px 24px',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '20px',
                color: 'rgba(148, 163, 184, 0.8)',
                fontSize: '14px',
                letterSpacing: '2px',
                background: 'rgba(59, 130, 246, 0.05)',
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* 底部提示 */}
        <p
          style={{
            marginTop: '40px',
            color: 'rgba(148, 163, 184, 0.5)',
            fontSize: '14px',
            letterSpacing: '2px',
          }}
        >
          Powered by Next.js & Ant Design
        </p>
      </div>

      {/* 右半部分 - 注册表单 (悬浮定位) */}
      <div
        style={{
          position: 'fixed',
          right: '8%',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '520px',
          maxHeight: '85vh',
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: '100%',
            maxHeight: '85vh',
            overflowY: 'auto',
            padding: '40px 35px',
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            position: 'relative',
            animation: 'float 6s ease-in-out infinite',
            boxSizing: 'border-box',
          }}
        >
          {/* 表单顶部装饰线 */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, transparent, #3b82f6, #60a5fa, #3b82f6, transparent)',
            }}
          />

          {/* 角标装饰 */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '40px',
              height: '40px',
              border: '2px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ScanOutlined style={{ color: '#3b82f6', fontSize: '20px' }} />
          </div>

          {/* 返回登录按钮 */}
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleBackToLogin}
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              background: 'transparent',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: '#60a5fa',
              borderRadius: '8px',
            }}
          >
            返回登录
          </Button>

          {/* 表单标题 */}
          <h2
            style={{
              fontSize: '28px',
              fontWeight: '700',
              margin: '60px 0 10px 0',
              background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '4px',
              textAlign: 'center',
            }}
          >
            用户注册
          </h2>

          <p
            style={{
              color: 'rgba(148, 163, 184, 0.7)',
              fontSize: '14px',
              margin: '0 0 30px 0',
              letterSpacing: '2px',
              textAlign: 'center',
            }}
          >
            创建您的账户，开启智慧管理之旅
          </p>

          {/* 角色选择 */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '24px',
            }}
          >
            <Button
              block
              onClick={() => {
                setRole('student');
                form.resetFields();
              }}
              style={{
                height: '44px',
                fontSize: '15px',
                fontWeight: '600',
                borderRadius: '10px',
                background: role === 'student' 
                  ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                  : 'rgba(30, 41, 59, 0.5)',
                border: role === 'student' 
                  ? 'none'
                  : '1px solid rgba(59, 130, 246, 0.2)',
                color: role === 'student' ? '#fff' : 'rgba(148, 163, 184, 0.8)',
                boxShadow: role === 'student' 
                  ? '0 4px 15px rgba(59, 130, 246, 0.4)'
                  : 'none',
                transition: 'all 0.3s ease',
                letterSpacing: '2px',
              }}
            >
              👨‍🎓 学生注册
            </Button>
            <Button
              block
              onClick={() => {
                setRole('teacher');
                form.resetFields();
              }}
              style={{
                height: '44px',
                fontSize: '15px',
                fontWeight: '600',
                borderRadius: '10px',
                background: role === 'teacher' 
                  ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                  : 'rgba(30, 41, 59, 0.5)',
                border: role === 'teacher' 
                  ? 'none'
                  : '1px solid rgba(59, 130, 246, 0.2)',
                color: role === 'teacher' ? '#fff' : 'rgba(148, 163, 184, 0.8)',
                boxShadow: role === 'teacher' 
                  ? '0 4px 15px rgba(59, 130, 246, 0.4)'
                  : 'none',
                transition: 'all 0.3s ease',
                letterSpacing: '2px',
              }}
            >
              👨‍🏫 教师注册
            </Button>
          </div>

          {/* 注册表单 */}
          <Form
            form={form}
            name="register"
            onFinish={handleRegister}
            layout="vertical"
            size="large"
            autoComplete="off"
          >
            {/* 公共字段 */}
            <Form.Item
              name="name"
              label="姓名"
              rules={[{ required: true, message: '请输入姓名!' }]}
            >
              <Input
                prefix={<UserOutlined style={{ color: 'rgba(59, 130, 246, 0.8)' }} />}
                placeholder="请输入姓名"
                className="tech-input"
              />
            </Form.Item>

            <Form.Item
              name="gender"
              label="性别"
              rules={[{ required: true, message: '请选择性别!' }]}
            >
              <Select placeholder="请选择性别" className="tech-input">
                <Option value="男">男</Option>
                <Option value="女">女</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="age"
              label="年龄"
              rules={[{ required: true, message: '请输入年龄!' }]}
            >
              <Input
                type="number"
                placeholder="请输入年龄"
                className="tech-input"
              />
            </Form.Item>

            <Form.Item
              name="phone"
              label="手机号"
              rules={[
                { required: true, message: '请输入手机号!' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号!' }
              ]}
            >
              <Input
                placeholder="请输入手机号"
                className="tech-input"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { required: true, message: '请输入邮箱!' },
                { type: 'email', message: '请输入有效的邮箱地址!' }
              ]}
            >
              <Input
                placeholder="请输入邮箱"
                className="tech-input"
              />
            </Form.Item>

            {/* 学生特有字段 */}
            {role === 'student' && (
              <>
                <Form.Item
                  name="idCard"
                  label="身份证号"
                  rules={[
                    { required: true, message: '请输入身份证号!' },
                    { pattern: /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/, message: '请输入有效的身份证号!' }
                  ]}
                >
                  <Input
                    placeholder="请输入身份证号"
                    className="tech-input"
                  />
                </Form.Item>

                <Form.Item
                  name="major"
                  label="专业"
                  rules={[{ required: true, message: '请输入专业!' }]}
                >
                  <Input
                    placeholder="请输入专业名称"
                    className="tech-input"
                  />
                </Form.Item>

                <Form.Item
                  name="className"
                  label="班级"
                  rules={[{ required: true, message: '请输入班级!' }]}
                >
                  <Input
                    placeholder="例如：计算机1班"
                    className="tech-input"
                  />
                </Form.Item>

                <Form.Item
                  name="grade"
                  label="年级"
                  rules={[{ required: true, message: '请输入年级!' }]}
                >
                  <Input
                    placeholder="例如：2024级"
                    className="tech-input"
                  />
                </Form.Item>

                <Form.Item
                  name="enrollDate"
                  label="入学日期"
                  rules={[{ required: true, message: '请选择入学日期!' }]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    placeholder="请选择入学日期"
                    className="tech-input"
                  />
                </Form.Item>
              </>
            )}

            {/* 教师特有字段 */}
            {role === 'teacher' && (
              <>
                <Form.Item
                  name="department"
                  label="所属院系"
                  rules={[{ required: true, message: '请输入所属院系!' }]}
                >
                  <Input
                    placeholder="请输入院系名称"
                    className="tech-input"
                  />
                </Form.Item>

                <Form.Item
                  name="researchArea"
                  label="研究方向"
                  rules={[{ required: true, message: '请输入研究方向!' }]}
                >
                  <Input
                    placeholder="例如：人工智能、数据库系统"
                    className="tech-input"
                  />
                </Form.Item>

                <Form.Item
                  name="officeLocation"
                  label="办公地点"
                  rules={[{ required: true, message: '请输入办公地点!' }]}
                >
                  <Input
                    placeholder="例如：计算机楼301室"
                    className="tech-input"
                  />
                </Form.Item>

                <Form.Item
                  name="title"
                  label="职称"
                  rules={[{ required: true, message: '请选择职称!' }]}
                >
                  <Select placeholder="请选择职称" className="tech-input">
                    <Option value="教授">教授</Option>
                    <Option value="副教授">副教授</Option>
                    <Option value="讲师">讲师</Option>
                    <Option value="助教">助教</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="education"
                  label="学历"
                  rules={[{ required: true, message: '请选择学历!' }]}
                >
                  <Select placeholder="请选择学历" className="tech-input">
                    <Option value="博士">博士</Option>
                    <Option value="硕士">硕士</Option>
                    <Option value="本科">本科</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="hireDate"
                  label="入职日期"
                  rules={[{ required: true, message: '请选择入职日期!' }]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    placeholder="请选择入职日期"
                    className="tech-input"
                  />
                </Form.Item>
              </>
            )}

            {/* 密码字段 - 放在最后 */}
            <Form.Item
              name="password"
              label="密码"
              rules={[
                { required: true, message: '请输入密码!' },
                { validator: validatePassword }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: 'rgba(59, 130, 246, 0.8)' }} />}
                placeholder="请输入密码"
                className="tech-input"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="确认密码"
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认密码!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: 'rgba(59, 130, 246, 0.8)' }} />}
                placeholder="请再次输入密码"
                className="tech-input"
              />
            </Form.Item>

            <Form.Item style={{ marginTop: '20px' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="tech-button"
              >
                {loading ? '注册中...' : '注 册'}
              </Button>
            </Form.Item>
          </Form>

          {/* 底部登录链接 */}
          <div
            style={{
              textAlign: 'center',
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(59, 130, 246, 0.1)',
            }}
          >
            <span style={{ color: 'rgba(148, 163, 184, 0.6)', fontSize: '14px' }}>
              已有账户?{' '}
            </span>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                router.push('/');
              }}
              style={{
                color: '#60a5fa',
                fontSize: '14px',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#3b82f6')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#60a5fa')}
            >
              立即登录
            </a>
          </div>
        </div>
      </div>

      {/* 全局样式 - 动画和特效 */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }

        /* 登录表单悬浮动画 */
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .tech-input:hover,
        .tech-input:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
        }

        /* 修复 placeholder 颜色 - 使用更强的选择器 */
        .tech-input input::placeholder,
        .tech-input textarea::placeholder,
        .tech-input .ant-select-selection-placeholder {
          color: rgba(148, 163, 184, 0.7) !important;
          opacity: 1 !important;
        }

        /* 兼容不同浏览器 */
        .tech-input input::-webkit-input-placeholder,
        .tech-input textarea::-webkit-input-placeholder {
          color: rgba(148, 163, 184, 0.7) !important;
          opacity: 1 !important;
        }

        .tech-input input::-moz-placeholder,
        .tech-input textarea::-moz-placeholder {
          color: rgba(148, 163, 184, 0.7) !important;
          opacity: 1 !important;
        }

        .tech-input input:-ms-input-placeholder,
        .tech-input textarea:-ms-input-placeholder {
          color: rgba(148, 163, 184, 0.7) !important;
          opacity: 1 !important;
        }

        .tech-button {
          height: 52px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 12px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border: none;
          box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
          transition: all 0.3s ease;
          letter-spacing: 4px;
          margin-top: 10px;
        }

        .tech-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 30px rgba(59, 130, 246, 0.6) !important;
        }

        .tech-button:active {
          transform: translateY(0);
        }

        /* Form Item Label 样式 */
        .ant-form-item-label > label {
          color: rgba(148, 163, 184, 0.9) !important;
          font-weight: 500;
        }

        .ant-form-item-label > label::before {
          color: rgba(239, 68, 68, 0.8) !important;
        }

        /* 自定义滚动条 */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.3);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }

        /* Select 下拉框样式 */
        .ant-select-dropdown {
          background: rgba(15, 23, 42, 0.95) !important;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(59, 130, 246, 0.3) !important;
          border-radius: 8px !important;
        }

        .ant-select-item {
          color: rgba(148, 163, 184, 0.9) !important;
        }

        .ant-select-item-option-selected {
          background: rgba(59, 130, 246, 0.2) !important;
          color: #60a5fa !important;
        }

        .ant-select-item-option-active {
          background: rgba(59, 130, 246, 0.1) !important;
        }

        /* DatePicker 样式 */
        .ant-picker {
          background: rgba(30, 41, 59, 0.5) !important;
          border: 1px solid rgba(59, 130, 246, 0.2) !important;
          border-radius: 12px !important;
          color: #e2e8f0 !important;
        }

        .ant-picker:hover,
        .ant-picker-focused {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
        }

        .ant-picker-input > input {
          color: #e2e8f0 !important;
        }

        .ant-picker-input > input::placeholder {
          color: rgba(148, 163, 184, 0.7) !important;
        }

        .ant-picker-dropdown {
          background: rgba(15, 23, 42, 0.95) !important;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(59, 130, 246, 0.3) !important;
          border-radius: 8px !important;
        }
      `}</style>
    </div>
  );
}
