import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { clearAuthCookie, getCurrentUser } from '@/lib/auth';
import ActivityLog from '@/models/ActivityLog';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
  const userAgent = request.headers.get('user-agent') || '';

  try {
    const currentUser = await getCurrentUser();

    if (currentUser) {
      await connectDB();
      await ActivityLog.create({
        userId: currentUser.userId,
        username: currentUser.name,
        name: currentUser.name,
        role: currentUser.role,
        action: 'logout',
        ip,
        userAgent,
      });
    }
  } catch (error) {
    console.error('记录登出日志失败:', error);
  }

  await clearAuthCookie();
  return NextResponse.json({
    success: true,
    message: '已退出登录',
  });
}
