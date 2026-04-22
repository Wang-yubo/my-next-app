import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Enrollment from '@/models/Enrollment';
import Course from '@/models/Course';

// GET - 获取选课列表
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const search = searchParams.get('search') || '';
    const studentId = searchParams.get('studentId');
    const courseId = searchParams.get('courseId');

    // 构建查询条件
    const query: any = { status: '已选课' };
    
    // 如果提供了学生ID和课程ID，则用于检查重复选课
    if (studentId && courseId) {
      query.studentId = studentId;
      query.courseId = courseId;
    } else if (search) {
      query.$or = [
        { courseCode: { $regex: search, $options: 'i' } },
        { courseName: { $regex: search, $options: 'i' } },
        { teacher: { $regex: search, $options: 'i' } },
      ];
    }

    // 计算分页
    const skip = (page - 1) * pageSize;

    // 查询数据
    const [enrollments, total] = await Promise.all([
      Enrollment.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Enrollment.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: enrollments,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('获取选课列表失败:', error);
    return NextResponse.json(
      { success: false, message: '获取数据失败' },
      { status: 500 }
    );
  }
}

// POST - 创建选课
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { courseId, studentId } = body;

    // 检查课程是否存在且状态为开设中
    const course: any = await Course.findById(courseId).lean();
    if (!course) {
      return NextResponse.json(
        { success: false, message: '课程不存在' },
        { status: 404 }
      );
    }

    if (course.status !== '开设中') {
      return NextResponse.json(
        { success: false, message: '该课程当前不可选' },
        { status: 400 }
      );
    }

    // 检查是否已达到最大选课人数
    if (course.enrolledStudents >= course.maxStudents) {
      return NextResponse.json(
        { success: false, message: '该课程已满员，无法选课' },
        { status: 400 }
      );
    }

    // 检查学生是否已经选过这门课
    const existingEnrollment = await Enrollment.findOne({
      studentId,
      courseId,
      status: '已选课',
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { success: false, message: '您已经选过这门课程' },
        { status: 400 }
      );
    }

    // 创建选课记录
    const enrollment = await Enrollment.create({
      studentId,
      courseId,
      courseCode: course.courseCode,
      courseName: course.courseName,
      credit: course.credit,
      teacher: course.teacher.name,
      schedule: course.schedule,
      classroom: `${course.classroom.building} ${course.classroom.roomNumber}`,
      enrollDate: new Date(),
      status: '已选课',
    });

    // 更新课程的已选课人数
    await Course.findByIdAndUpdate(courseId, {
      $inc: { enrolledStudents: 1 },
    });

    return NextResponse.json({
      success: true,
      data: enrollment,
      message: '选课成功',
    });
  } catch (error: any) {
    console.error('创建选课失败:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: '重复选课' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: '选课失败' },
      { status: 500 }
    );
  }
}
