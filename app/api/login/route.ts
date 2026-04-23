import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Student from '@/models/Student';
import Teacher from '@/models/Teacher';
import bcrypt from 'bcryptjs';
import { generateToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { username, password, role } = await request.json();

    // 验证必填字段
    if (!username || !password || !role) {
      return NextResponse.json(
        { success: false, message: '请填写所有必填字段' },
        { status: 400 } as any
      );
    }

    if (!['student', 'teacher'].includes(role)) {
      return NextResponse.json(
        { success: false, message: '无效的角色类型' },
        { status: 400 } as any
      );
    }

    // 查找用户（支持学号/工号或邮箱登录）
    let user;
    if (role === 'student') {
      user = await Student.findOne({ 
        $or: [{ email: username }, { id: username }] 
      });
    } else {
      user = await Teacher.findOne({ 
        $or: [{ email: username }, { id: username }] 
      });
    }

    console.log('登录调试信息:', {
      username,
      role,
      userFound: !!user,
      userName: user?.name,
      userEmail: user?.email,
      hasPassword: !!user?.password,
      passwordType: typeof user?.password,
      passwordLength: user?.password?.length || 0
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: '用户名或密码错误' },
        { status: 401 } as any
      );
    }

    // 检查用户是否有密码
    if (!user.password) {
      console.error(`用户 ${user.email} 没有设置密码`, {
        passwordValue: user.password,
        passwordType: typeof user.password,
        userKeys: Object.keys(user.toObject ? user.toObject() : user)
      });
      return NextResponse.json(
        { success: false, message: '该账户未设置密码，请联系管理员' },
        { status: 401 } as any
      );
    }

    // 验证密码（使用 bcrypt 对比）
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: '用户名或密码错误' },
        { status: 401 } as any
      );
    }

    // 生成 JWT Token
    const token = await generateToken({
      userId: user.id,
      role: role,
      email: user.email,
      name: user.name,
    });

    // 设置 HttpOnly Cookie
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      message: '登录成功',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: role,
        },
      },
    });
  } catch (error: any) {
    console.error('登录错误:', error);
    return NextResponse.json(
      { success: false, message: error.message || '登录失败，请稍后重试' },
      { status: 500 } as any
    );
  }
}
