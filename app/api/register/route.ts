import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Student from '@/models/Student';
import Teacher from '@/models/Teacher';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { role, ...userData } = body;

    if (!role || !['student', 'teacher'].includes(role)) {
      return NextResponse.json(
        { success: false, message: '无效的角色类型' },
        { status: 400 } as any
      );
    }

    // 验证必填字段
    if (!userData.name || !userData.email || !userData.phone || !userData.password) {
      return NextResponse.json(
        { success: false, message: '请填写所有必填字段' },
        { status: 400 } as any
      );
    }

    // 验证密码格式（前端已加密，这里检查长度）
    if (userData.password.length < 6) {
      return NextResponse.json(
        { success: false, message: '密码长度必须大于6位' },
        { status: 400 } as any
      );
    }

    let result;

    if (role === 'student') {
      // 验证学生必填字段
      if (!userData.gender || !userData.age || !userData.idCard || !userData.major || !userData.className || !userData.grade || !userData.enrollDate) {
        return NextResponse.json(
          { success: false, message: '请完善学生信息' },
          { status: 400 } as any
        );
      }

      // 生成学号（S + 年份 + 已注册学生总数+1，不足6位补0）
      const year = new Date().getFullYear();
      const studentCount = await Student.countDocuments();
      const sequenceNumber = String(studentCount + 1).padStart(6, '0');
      const studentId = `S${year}${sequenceNumber}`;

      // 检查身份证号是否已存在
      const existingIdCard = await Student.findOne({ idCard: userData.idCard });
      if (existingIdCard) {
        return NextResponse.json(
          { success: false, message: '该身份证号已被注册' },
          { status: 409 } as any
        );
      }

      // 检查邮箱是否已存在
      const existingEmail = await Student.findOne({ email: userData.email });
      if (existingEmail) {
        return NextResponse.json(
          { success: false, message: '该邮箱已被注册' },
          { status: 409 } as any
        );
      }

      // 使用 bcrypt 加密密码（salt rounds = 10）
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      result = await Student.create({
        id: studentId,
        ...userData,
        password: hashedPassword,
        enrollDate: new Date(userData.enrollDate),
        status: '在读',
      });
    } else {
      // 验证教师必填字段
      if (!userData.gender || !userData.age || !userData.department || !userData.researchArea || !userData.officeLocation || !userData.title || !userData.education || !userData.hireDate) {
        return NextResponse.json(
          { success: false, message: '请完善教师信息' },
          { status: 400 } as any
        );
      }

      // 生成工号（T + 年份 + 已注册教师总数+1，不足6位补0）
      const year = new Date().getFullYear();
      const teacherCount = await Teacher.countDocuments();
      const sequenceNumber = String(teacherCount + 1).padStart(6, '0');
      const teacherId = `T${year}${sequenceNumber}`;

      // 检查邮箱是否已存在
      const existingEmail = await Teacher.findOne({ email: userData.email });
      if (existingEmail) {
        return NextResponse.json(
          { success: false, message: '该邮箱已被注册' },
          { status: 409 } as any
        );
      }

      // 使用 bcrypt 加密密码（salt rounds = 10）
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      result = await Teacher.create({
        id: teacherId,
        ...userData,
        password: hashedPassword,
        hireDate: new Date(userData.hireDate),
        status: '在职',
      });
    }

    return NextResponse.json(
      { 
        success: true, 
        message: '注册成功',
        data: result 
      },
      { status: 201 } as any
    );
  } catch (error: any) {
    console.error('注册错误:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || '注册失败，请稍后重试' 
      },
      { status: 500 } as any
    );
  }
}
