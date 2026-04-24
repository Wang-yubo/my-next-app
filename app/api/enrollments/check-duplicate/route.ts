import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Enrollment from '@/models/Enrollment';
import { getCurrentUser } from '@/lib/auth';

// GET - 检查当前学生是否已选某课程（用于前端重复选课检查）
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // 获取当前登录用户信息
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: '未登录或登录已过期' },
        { status: 401 }
      );
    }

    // 验证用户角色必须是学生
    if (currentUser.role !== 'student') {
      return NextResponse.json(
        { success: false, message: '只有学生可以选课' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json(
        { success: false, message: '缺少课程ID参数' },
        { status: 400 }
      );
    }

    // 检查是否已选该课程
    const existingEnrollment = await Enrollment.findOne({
      studentId: currentUser.userId,
      courseId,
      status: '已选课',
    });

    return NextResponse.json({
      success: true,
      isDuplicate: !!existingEnrollment,
    });
  } catch (error) {
    console.error('检查重复选课失败:', error);
    return NextResponse.json(
      { success: false, message: '检查失败' },
      { status: 500 }
    );
  }
}
