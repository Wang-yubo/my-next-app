'use client';

import { Button, Input, Form, Checkbox, message } from 'antd';
import { ArrowRightOutlined, UserOutlined, LockOutlined, ScanOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'student' | 'teacher'>('student');

  const handleLogin = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
          role: role,
        }),
      });

      const result = await response.json();

      if (result.success) {
        message.success('登录成功！');
        // 保存用户信息到 localStorage
        localStorage.setItem('user_info', JSON.stringify(result.data.user));
        router.push('/dashboard');
      } else {
        message.error(result.message || '登录失败');
      }
    } catch (error) {
      console.error('登录错误:', error);
      message.error('登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
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
          欢迎
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

      {/* 右半部分 - 登录表单 (悬浮定位) */}
      <div
        style={{
          position: 'fixed',
          right: '8%',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '480px',
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: '100%',
            padding: '50px 40px',
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            position: 'relative',
            overflow: 'hidden',
            animation: 'float 6s ease-in-out infinite',
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

          {/* 表单标题 */}
          <h2
            style={{
              fontSize: '32px',
              fontWeight: '700',
              margin: '0 0 10px 0',
              background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '4px',
            }}
          >
            系统登录
          </h2>

          <p
            style={{
              color: 'rgba(148, 163, 184, 0.7)',
              fontSize: '14px',
              margin: '0 0 40px 0',
              letterSpacing: '2px',
            }}
          >
            欢迎回来，请登录您的账户
          </p>

          {/* 登录表单 */}
          <Form
            name="login"
            onFinish={handleLogin}
            layout="vertical"
            size="large"
            autoComplete="off"
          >
            {/* 角色选择 */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '20px',
              }}
            >
              <Button
                block
                onClick={() => setRole('student')}
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
                👨‍🎓 学生
              </Button>
              <Button
                block
                onClick={() => setRole('teacher')}
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
                👨‍🏫 教师
              </Button>
            </div>

            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名!' }]}
            >
              <Input
                prefix={<UserOutlined style={{ color: 'rgba(59, 130, 246, 0.8)' }} />}
                placeholder="学号/工号 / 邮箱"
                style={{
                  height: '50px',
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '12px',
                  color: '#e2e8f0',
                  fontSize: '15px',
                  transition: 'all 0.3s ease',
                }}
                className="tech-input"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码!' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: 'rgba(59, 130, 246, 0.8)' }} />}
                placeholder="密码"
                style={{
                  height: '50px',
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '12px',
                  color: '#e2e8f0',
                  fontSize: '15px',
                  transition: 'all 0.3s ease',
                }}
                className="tech-input"
              />
            </Form.Item>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px',
              }}
            >
              <Checkbox
                style={{
                  color: 'rgba(148, 163, 184, 0.8)',
                  fontSize: '14px',
                }}
              >
                记住我
              </Checkbox>
              <a
                href="#"
                style={{
                  color: '#60a5fa',
                  fontSize: '14px',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#3b82f6')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#60a5fa')}
              >
                忘记密码?
              </a>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{
                  height: '52px',
                  fontSize: '16px',
                  fontWeight: '600',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
                  transition: 'all 0.3s ease',
                  letterSpacing: '4px',
                  marginTop: '10px',
                }}
                className="tech-button"
              >
                {loading ? '登录中...' : '登 录'}
              </Button>
            </Form.Item>
          </Form>

          {/* 底部注册链接 */}
          <div
            style={{
              textAlign: 'center',
              marginTop: '30px',
              paddingTop: '30px',
              borderTop: '1px solid rgba(59, 130, 246, 0.1)',
            }}
          >
            <span style={{ color: 'rgba(148, 163, 184, 0.6)', fontSize: '14px' }}>
              还没有账户?{' '}
            </span>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                router.push('/register');
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
              立即注册
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
        .tech-input textarea::placeholder {
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

        .tech-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 30px rgba(59, 130, 246, 0.6) !important;
        }

        .tech-button:active {
          transform: translateY(0);
        }

        /* 自定义滚动条 */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.3);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.4);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.6);
        }
      `}</style>
    </div>
  );
}
