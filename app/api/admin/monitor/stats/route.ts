import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import ActivityLog from '@/models/ActivityLog';

export async function GET() {
  try {
    await connectDB();

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [todayLogin, todayLogout, totalLogs, recentLogins] = await Promise.all([
      ActivityLog.countDocuments({ action: 'login', createdAt: { $gte: todayStart } }),
      ActivityLog.countDocuments({ action: 'logout', createdAt: { $gte: todayStart } }),
      ActivityLog.countDocuments(),
      ActivityLog.find({ action: 'login' })
        .sort({ createdAt: -1 })
        .limit(1)
        .lean(),
    ]);

    const lastLogin = recentLogins.length > 0 ? recentLogins[0] : null;

    return NextResponse.json({
      success: true,
      data: {
        todayLogin,
        todayLogout,
        totalLogs,
        lastLoginAt: lastLogin?.createdAt || null,
        lastLoginUser: lastLogin ? { name: lastLogin.name, role: lastLogin.role } : null,
      },
    });
  } catch (error) {
    console.error('获取监控统计失败:', error);
    return NextResponse.json(
      { success: false, message: '获取数据失败' },
      { status: 500 }
    );
  }
}
