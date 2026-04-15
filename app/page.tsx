'use client';

import { Button } from 'antd';
import { ArrowRightOutlined, RocketOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

export default function WelcomePage() {
  const router = useRouter();

  const handleEnter = () => {
    router.push('/dashboard');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #0d1229 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
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

      {/* 主内容 */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          padding: '40px 20px',
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

        {/* 进入系统按钮 */}
        <Button
          type="primary"
          size="large"
          onClick={handleEnter}
          icon={<ArrowRightOutlined />}
          style={{
            height: '56px',
            padding: '0 40px',
            fontSize: '18px',
            fontWeight: '600',
            borderRadius: '28px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            border: 'none',
            boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
            transition: 'all 0.3s ease',
            letterSpacing: '4px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 30px rgba(59, 130, 246, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(59, 130, 246, 0.4)';
          }}
        >
          进入系统
        </Button>

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

      {/* 全局样式 - 动画 */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
