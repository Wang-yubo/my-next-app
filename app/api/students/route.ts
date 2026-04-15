import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Student from '@/models/Student';

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
      { status: 500 }
    );
  }
}

// POST - 创建学生
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // 生成学号
    const count = await Student.countDocuments();
    const year = new Date().getFullYear();
    const studentId = `${year}${String(count + 1).padStart(3, '0')}`;

    const student = await Student.create({
      id: studentId,
      name: body.name,
      gender: body.gender,
      age: body.age,
      major: body.major,
      grade: body.grade,
      phone: body.phone,
      email: body.email,
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
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: '创建失败' },
      { status: 500 }
    );
  }
}
