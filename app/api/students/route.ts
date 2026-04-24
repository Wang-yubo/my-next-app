import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Student from '@/models/Student';
import bcrypt from 'bcryptjs';

// GET - 获取学生列表
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const search = searchParams.get('search') || '';

    // 构建查询条件
    const query: any = {};
    if (search) {
      query.$or = [
        { id: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { major: { $regex: search, $options: 'i' } },
      ];
    }

    // 计算分页
    const skip = (page - 1) * pageSize;

    // 查询数据
    const [students, total] = await Promise.all([
      Student.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Student.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: students,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('获取学生列表失败:', error);
    return NextResponse.json(
      { success: false, message: '获取数据失败' },
      { status: 500 } as any
    );
  }
}

// POST - 创建学生
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // 生成学号（S + 年份 + 已注册学生总数+1，不足6位补0）
    const year = new Date().getFullYear();
    const studentCount = await Student.countDocuments();
    const sequenceNumber = String(studentCount + 1).padStart(6, '0');
    const studentId = `S${year}${sequenceNumber}`;

    // 使用 bcrypt 加密密码（salt rounds = 10）
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const student = await Student.create({
      id: studentId,
      name: body.name,
      gender: body.gender,
      age: body.age,
      major: body.major,
      className: body.className,
      grade: body.grade,
      idCard: body.idCard,
      phone: body.phone,
      email: body.email,
      password: hashedPassword,
      status: body.status || '在读',
      enrollDate: body.enrollDate || new Date(),
    });

    return NextResponse.json({
      success: true,
      data: student,
      message: '添加成功',
    });
  } catch (error: any) {
    console.error('创建学生失败:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: '学号已存在' },
        { status: 400 } as any
      );
    }
    return NextResponse.json(
      { success: false, message: '创建失败' },
      { status: 500 } as any
    );
  }
}
