import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AdminUser from '@/models/AdminUser';
import '@/models/Role';
import Role from '@/models/Role';
import Student from '@/models/Student';
import Teacher from '@/models/Teacher';
import ActivityLog from '@/models/ActivityLog';
import bcrypt from 'bcryptjs';
import { generateToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: '请输入用户名和密码' },
        { status: 400 } as any
      );
    }

    let user: any = null;
    let role: string = '';
    let name: string = '';
    let userId: string = '';
    let permissions: string[] = [];

    const adminUser = await AdminUser.findOne({
      $or: [{ username }, { email: username }],
    }).populate('roles', 'permissions');

    if (adminUser) {
      const isPasswordValid = await bcrypt.compare(password, adminUser.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, message: '用户名或密码错误' },
          { status: 401 } as any
        );
      }

      if (adminUser.status === 'disabled') {
        return NextResponse.json(
          { success: false, message: '该账户已被禁用，无法登录' },
          { status: 403 } as any
        );
      }

      user = adminUser;
      role = 'admin';
      name = adminUser.nickname || adminUser.username;
      userId = adminUser._id.toString();

      if (adminUser.roles && adminUser.roles.length > 0) {
        for (const r of adminUser.roles) {
          if ((r as any).permissions) {
            permissions.push(...(r as any).permissions);
          }
        }
      }
    } else {
      const student = await Student.findOne({
        $or: [{ email: username }, { id: username }],
      });

      if (student) {
        const isPasswordValid = await bcrypt.compare(password, student.password);
        if (!isPasswordValid) {
          return NextResponse.json(
            { success: false, message: '用户名或密码错误' },
            { status: 401 } as any
          );
        }

        if (student.status !== '在读') {
          return NextResponse.json(
            { success: false, message: '该账户已被禁用，无法登录' },
            { status: 403 } as any
          );
        }

        user = student;
        role = 'student';
        name = student.name;
        userId = student.id;

        const studentRole = await Role.findOne({ code: 'student' }).lean();
        if (studentRole) {
          permissions = (studentRole as any).permissions || [];
        }
      } else {
        const teacher = await Teacher.findOne({
          $or: [{ email: username }, { id: username }],
        });

        if (teacher) {
          const isPasswordValid = await bcrypt.compare(password, teacher.password);
          if (!isPasswordValid) {
            return NextResponse.json(
              { success: false, message: '用户名或密码错误' },
              { status: 401 } as any
            );
          }

          if (teacher.status === '离职') {
            return NextResponse.json(
              { success: false, message: '该账户已被禁用，无法登录' },
              { status: 403 } as any
            );
          }

          user = teacher;
          role = 'teacher';
          name = teacher.name;
          userId = teacher.id;

          const teacherRole = await Role.findOne({ code: 'teacher' }).lean();
          if (teacherRole) {
            permissions = (teacherRole as any).permissions || [];
          }
        }
      }
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: '用户名或密码错误' },
        { status: 401 } as any
      );
    }

    if (!user.password) {
      return NextResponse.json(
        { success: false, message: '该账户未设置密码，请联系管理员' },
        { status: 401 } as any
      );
    }

    const token = await generateToken({
      userId,
      role: role as 'student' | 'teacher' | 'admin',
      email: user.email,
      name,
    });

    await setAuthCookie(token);

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || '';

    await ActivityLog.create({
      userId,
      username: name,
      name,
      role,
      action: 'login',
      ip,
      userAgent,
    });

    return NextResponse.json({
      success: true,
      message: '登录成功',
      data: {
        user: {
          id: userId,
          name,
          email: user.email,
          role,
        },
        permissions,
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
