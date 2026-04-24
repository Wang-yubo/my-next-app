import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Course from '@/models/Course';
import Enrollment from '@/models/Enrollment';
import { getCurrentUser } from '@/lib/auth';

// GET - 获取课程列表（所有用户可查看全部课程）
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const search = searchParams.get('search') || '';

    // 构建查询条件
    const query: any = {};
    
    // 添加搜索条件
    if (search) {
      query.$or = [
        { courseCode: { $regex: search, $options: 'i' } },
        { courseName: { $regex: search, $options: 'i' } },
        { 'teacher.name': { $regex: search, $options: 'i' } },
      ];
    }

    // 计算分页
    const skip = (page - 1) * pageSize;

    // 查询数据
    const [courses, total] = await Promise.all([
      Course.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Course.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: courses,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('获取课程列表失败:', error);
    return NextResponse.json(
      { success: false, message: '获取数据失败' },
      { status: 500 }
    );
  }
}

// POST - 创建课程
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // 生成课程编号
    const count = await Course.countDocuments();
    const year = new Date().getFullYear();
    const courseCode = `CS${year}${String(count + 1).padStart(3, '0')}`;

    const course = await Course.create({
      courseCode,
      courseName: body.courseName,
      description: body.description,
      credit: body.credit,
      hours: body.hours,
      semester: body.semester,
      textbook: body.textbook,
      teacher: body.teacher,
      classroom: body.classroom,
      tuition: body.tuition,
      maxStudents: body.maxStudents,
      status: body.status || '开设中',
      schedule: body.schedule,
      prerequisite: body.prerequisite || [],
    });

    return NextResponse.json({
      success: true,
      data: course,
      message: '添加成功',
    });
  } catch (error: any) {
    console.error('创建课程失败:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: '课程编号已存在' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: '创建失败' },
      { status: 500 }
    );
  }
}
